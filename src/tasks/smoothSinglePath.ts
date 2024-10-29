import { Effect, Console, Either, Ref, pipe } from "effect";
import { PaperEngine } from "../svg-engine/paper-engine";
import type { Paper } from "../paper/type";
import {
  getSplitCurves,
  getMinLengthFromCurves,
  getAbsBetweenAngleFromCurves,
  getAbsBetweenAngleFromVectors,
  getMidLinearIndexes,
} from "./utils/geometry";
import { circularForEach, circularModulo } from "./utils/iterate";

import { isSinglePath } from "./utils/guard";
import { SVGProcessorContext } from "../svg-engine/svgProcessor.context";

/**
 * @param roundness - 둥근 정도 (0 ~ 100)
 * @returns 부드러운 path
 */
export const smoothSinglePath = (item: Paper.Item) =>
  Effect.gen(function* () {
    // 의존성 로드
    const { paper } = yield* PaperEngine;

    // 컨텍스트 로드
    const contextRef = yield* SVGProcessorContext;
    const context = yield* Ref.get(contextRef);

    if (!context.debug && context.roundness === 0) {
      return item;
    }

    // 디버깅용 변수
    const DEBUG = context.debug;
    const debugPaths: Paper.Path[] = [];

    // 작업 수행

    const paths =
      item instanceof paper.Path
        ? [item]
        : (item.getItems({
            class: paper.Path,
          }) as Paper.Path[]);

    console.log("[smoothSinglePath] paths", paths);

    // path 개수 검증: 하나만 있어야 함.
    yield* isSinglePath(paths);

    // alias for convenience
    const path = paths[0];

    console.log("path curves", path.curves.length);

    // save path style
    const pathStyle = path.style;

    // path.curves에 대해 midlinear indexes
    const midLinearIndexes = yield* getMidLinearIndexes(path.curves);

    // midlinear indexes에 대해 2개로 split
    const midLinearSegmentedPathCurves: Paper.Curve[] = (yield* Effect.all(
      path.curves.map((curve, index) => {
        if (midLinearIndexes.includes(index)) {
          return getSplitCurves(curve, 2, { toLinear: true });
        } else {
          return Effect.succeed([curve]);
        }
      })
    )).flat();

    // 최소 길이 계산
    const minLength = yield* getMinLengthFromCurves(
      midLinearSegmentedPathCurves,
      {
        onlyLinear: true,
      }
    );

    // angle indexes 계산: 해당 index에 해당하는 위치에 roundness corner curve를 삽입예정
    const angleIndexes: number[] = [];
    const angles: number[] = [];

    yield* circularForEach(
      midLinearSegmentedPathCurves,
      (curvesWindow, index) =>
        Effect.gen(function* (_) {
          const angleResult = yield* Effect.either(
            getAbsBetweenAngleFromCurves(curvesWindow[0], curvesWindow[1])
          );

          if (Either.isLeft(angleResult)) {
            return Effect.yieldNow();
          }
          const angle = Either.getOrThrow(angleResult);
          const moduloAngle = circularModulo(angle, 360);
          if (
            [0, 180, 360].some((value) => Math.abs(moduloAngle - value) < 0.001)
          ) {
            return Effect.yieldNow();
          }
          angleIndexes.push(
            circularModulo(index + 1, midLinearSegmentedPathCurves.length)
          );
          angles.push(circularModulo(angle, 360));
        }),
      2
    );

    // 실제로 변화시킬 길이
    const referenceLength = minLength * context.roundness;

    console.log("referenceLength", referenceLength);

    const flatCurves: Paper.Curve[] = [];

    const getOffsetCurve = (
      curve: Paper.Curve,
      offsetLength: number,
      direction: "start" | "end"
    ) => {
      const startPoint =
        direction === "start" ? curve.segment1.point : curve.segment2.point;
      const endPoint =
        direction === "start" ? curve.segment2.point : curve.segment1.point;

      const dividePoint = startPoint.add(
        endPoint.subtract(startPoint).multiply(offsetLength / curve.length)
      );

      // 새로운 curve 생성
      // curve.getPart는 정확한 길이를 보장하지 않음.
      const newCurve = new paper.Curve(
        new paper.Segment(startPoint),
        new paper.Segment(dividePoint)
      );

      return newCurve;
    };

    midLinearSegmentedPathCurves.forEach((_curve, index) => {
      const prevIndex = circularModulo(
        index,
        midLinearSegmentedPathCurves.length
      );
      const currentIndex = circularModulo(
        index + 1,
        midLinearSegmentedPathCurves.length
      );

      if (angleIndexes.includes(prevIndex)) {
        // path의 진행 방향 중 커브 직후 각도가 있는 경우
        const partCurve = getOffsetCurve(
          _curve,
          _curve.length - referenceLength,
          "end"
        );
        flatCurves.push(partCurve);
      } else if (angleIndexes.includes(currentIndex)) {
        // path의 진행 방향 중 커브 직전 각도가 있는 경우
        const partCurve = getOffsetCurve(
          _curve,
          _curve.length - referenceLength,
          "start"
        );
        flatCurves.push(partCurve);
      } else {
        flatCurves.push(_curve);
      }
    });

    const debugNewPoints: Paper.Point[] = [];

    // arc curve 계산.

    const createArc = (angleIndex: number) =>
      Effect.gen(function* (_) {
        const vector1Index =
          (angleIndex - 1 + midLinearSegmentedPathCurves.length) %
          midLinearSegmentedPathCurves.length;
        const vector2Index =
          (angleIndex + midLinearSegmentedPathCurves.length) %
          midLinearSegmentedPathCurves.length;

        const primaryPoint = midLinearSegmentedPathCurves[vector2Index].point1;

        const vector1 = midLinearSegmentedPathCurves[
          vector1Index
        ].segment2.point
          .subtract(midLinearSegmentedPathCurves[vector1Index].segment1.point)
          .normalize();
        const vector2 = midLinearSegmentedPathCurves[
          vector2Index
        ].segment2.point
          .subtract(midLinearSegmentedPathCurves[vector2Index].segment1.point)
          .normalize();

        const direnctionVector = vector2.add(vector1.multiply(-1)).normalize();

        const absBetweenAngle = yield* getAbsBetweenAngleFromVectors(
          vector1,
          vector2.multiply(-1)
        );

        const absBetweenAngleInRadians = absBetweenAngle * (Math.PI / 180);

        const multiplier =
          ((1 - Math.sin(absBetweenAngleInRadians / 2)) /
            Math.cos(absBetweenAngleInRadians / 2)) *
          referenceLength;

        const arcThrough = primaryPoint.add(
          direnctionVector.multiply(Math.abs(multiplier))
        );

        debugNewPoints.push(arcThrough);

        const arcFrom = primaryPoint.add(vector1.multiply(-referenceLength));
        const arcTo = primaryPoint.add(vector2.multiply(referenceLength));

        const resultArc = new paper.Path.Arc(arcFrom, arcThrough, arcTo);

        return resultArc;
      });

    // 결과에서만 사용할 타입
    type _ResultPath = {
      path: Paper.Path;
      index: number;
    };

    const resultArcs: _ResultPath[] = yield* Effect.all(
      angleIndexes
        .sort((a, b) => a - b)
        .map((angleIndex) =>
          pipe(
            createArc(angleIndex),
            Effect.map((path) => ({
              path,
              index: angleIndex,
            }))
          )
        )
    );

    console.log("resultArcs", resultArcs);

    const resultFlats: _ResultPath[] = flatCurves.map((curve, index) => ({
      path: new paper.Path([curve.segment1, curve.segment2]),
      index,
    }));

    const unitedPath = [...resultArcs, ...resultFlats]
      .sort((a, b) => a.index - b.index)
      .filter((path) => path.path.length > 0)
      .map((path) => path.path)
      .reduce((acc, path) => {
        acc.join(path);
        return acc;
      }, new paper.Path());

    const resultPath = unitedPath;
    resultPath.style = pathStyle;

    console.log("resultPath", resultPath.pathData);

    if (DEBUG) {
      /** DEBUG SCOPE */

      path.remove();

      // paths의 path에 속한 각 segment에 대해 새로운 path 생성

      const DEBUG_LINE_WIDTH_1 = 10;
      const DEBUG_LINE_WIDTH_2 = 3;

      flatCurves.forEach((curve, index) => {
        if (curve.hasHandles()) {
          const newPath = new paper.Path([curve.segment1, curve.segment2]);
          newPath.style.strokeColor = new paper.Color("#FF0000");

          newPath.style.strokeWidth = DEBUG_LINE_WIDTH_2;
          debugPaths.push(newPath);
        } else {
          const newPath = new paper.Path([curve.segment1, curve.segment2]);
          newPath.style.strokeColor = new paper.Color("#00FF00");

          newPath.style.strokeWidth = DEBUG_LINE_WIDTH_2;

          debugPaths.push(newPath);
        }
      });

      // 최소값을 유도한 선분에 대해 색상 변경
      debugPaths.forEach((path) => {
        if (Math.abs(path.length - minLength) < 0.001) {
          path.style.strokeColor = new paper.Color("#FF00FF");
        }
      });

      // 시작점 체크
      const firstCurve = new paper.Shape.Circle({
        center: path.curves[0].point1,
        radius: 10,
        fillColor: new paper.Color("#FFFFFF"),
      });

      const debugNewPointsItems: Paper.Item[] = [];

      // 디버그 점 체크
      debugNewPoints.forEach((point) => {
        const circle = new paper.Shape.Circle({
          center: point,
          radius: 2,
          fillColor: new paper.Color("#FFFF00"),
        });
        debugNewPointsItems.push(circle);
      });

      const debugResultPath = resultPath.clone();
      debugResultPath.style.strokeColor = new paper.Color("#FFFFFF");
      debugResultPath.style.strokeWidth = 5;
      debugResultPath.style.dashArray = [10, 10];
      debugResultPath.style.dashOffset = 10;
      debugResultPath.opacity = 0.5;

      item.addChildren(debugPaths);
      item.addChildren([firstCurve]);
      item.addChildren(debugNewPointsItems);
      item.addChildren([debugResultPath]);
    }

    // 원본 path 제거
    path.remove();

    // 결과 path 추가
    if (!DEBUG && item instanceof paper.Group) {
      item.addChildren([resultPath]);
    }

    yield* Effect.succeed(resultArcs.length > 0);

    // 반환
    return item instanceof paper.Group ? item : resultPath;
  });
