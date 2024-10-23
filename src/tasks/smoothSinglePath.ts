import { Effect } from "effect";
import { ProcessTask } from "./types";
import { PaperEngine } from "../svg-engine/paper-engine";
import type { Paper } from "../paper";
import { provideDependencies } from "../provideDependencies";

type AngleCurvePair = {
  angle: number;
  curve1: Paper.Curve;
  curve2: Paper.Curve;
};

// path 개수 검증
const isSinglePath = (paths: Paper.Path[]) =>
  paths.length === 0
    ? Effect.fail(new Error("No path to smooth"))
    : paths.length > 1
    ? Effect.fail(new Error("Multiple paths found"))
    : Effect.succeed(true);

/**
 * 최소 길이를 반환하는 함수
 * @param curves - 길이를 비교할 curve들
 * @param options - 옵션
 * @returns 최소 길이
 */
const getMinLengthFromCurves = (
  curves: Paper.Curve[],
  options: {
    /** linear한 curve만 고려할지 여부 */
    onlyLinear?: boolean;
  } = {}
) => {
  return curves.reduce((minLength, curve) => {
    if (options.onlyLinear && curve.hasHandles()) {
      return minLength;
    }
    return Math.min(minLength, curve.length);
  }, Infinity);
};

/**
 * 주어진 curve를 주어진 개수만큼 분할하는 함수
 * @param curve - 분할할 curve
 * @param splitCount - 분할할 개수
 * @param options - 옵션
 * @returns 분할된 curve들
 */
const getSplitCurves = (
  curve: Paper.Curve,
  splitCount: number,
  options?: {
    /** 선형으로 변환할지 여부 */
    toLinear?: boolean;
  }
) => {
  const result: Paper.Curve[] = Array.from({ length: splitCount }).map(
    (_, index) => {
      const splittedCurve = curve.getPart(
        index / splitCount,
        (index + 1) / splitCount
      );
      if (options?.toLinear) {
        splittedCurve.clearHandles();
      }
      return splittedCurve;
    }
  );
  return result;
};

/**
 * 순환 모듈로 연산을 수행하는 함수
 * @param index - 연산할 인덱스
 * @param length - 모듈로 연산할 길이
 * @returns 연산 결과
 */
const circularModulo = (index: number, length: number) =>
  (index + length) % length;

/**
 * 배열의 요소들을 순환하면서 callback을 실행하는 함수
 * @param array - 순환할 배열
 * @param callback - 각 요소에 대해 실행할 callback 함수
 * @param windowSize - 한 번에 처리할 요소의 개수 (기본값: 1)
 */
const circularForEach = <T>(
  array: T[],
  callback: (items: T[], index: number) => void,
  windowSize: number = 1
): void => {
  if (array.length === 0 || windowSize <= 0) {
    return;
  }

  for (let i = 0; i < array.length; i++) {
    const window: T[] = [];
    for (let j = 0; j < windowSize; j++) {
      const index = circularModulo(i + j, array.length);
      window.push(array[index]);
    }
    callback(window, i);
  }
};

/**
 * 선형 curve의 각도를 반환하는 함수
 * @param curve - 각도를 반환할 curve
 * @returns 각도
 */
const getAngleFromLinearCurve = (curve: Paper.Curve) => {
  const directionVector = curve.segment2.point.subtract(curve.segment1.point);
  return (directionVector.angle + 360) % 360;
};

// mid linear: 양쪽 curve가 모두 linear이고 자기 자신도 linear인 경우
const getMidLinearIndexes = (curves: Paper.Curve[]) => {
  const isMidLinear = (
    prev: Paper.Curve,
    curr: Paper.Curve,
    next: Paper.Curve
  ) => {
    if (prev.hasHandles() || curr.hasHandles() || next.hasHandles()) {
      return false;
    }

    return true;
  };

  const midLinearIndexes: number[] = [];

  circularForEach(
    curves,
    (curvesWindow, index) => {
      if (isMidLinear(curvesWindow[0], curvesWindow[1], curvesWindow[2])) {
        midLinearIndexes.push((index + 1) % curves.length);
      }
    },
    3
  );

  return midLinearIndexes;
};

/**
 * 두 curve 사이의 각도를 반환하는 함수
 * @param curve1 - 첫 번째 curve
 * @param curve2 - 두 번째 curve
 * @returns 각도 (1번 커브에서 2번 커브로 반시계가 +)
 */
const getBetweenAngle = (curve1: Paper.Curve, curve2: Paper.Curve) => {
  if (curve1.hasHandles() || curve2.hasHandles()) {
    console.log("curve has handles");
    return new Error("Curve has handles");
  }
  const directionVector1 = getAngleFromLinearCurve(curve1);
  const directionVector2 = getAngleFromLinearCurve(curve2);
  return directionVector2 - directionVector1;
};

const _smoothSinglePath: (
  roundness: number
) => ProcessTask<Paper.Item, Paper.Item> = (roundness) => (item: Paper.Item) =>
  Effect.gen(function* () {
    // 의존성 로드
    const paperEngine = yield* PaperEngine;

    // 환경 설정
    const paper = yield* paperEngine.setup(100, 100);

    // 작업 수행
    const paths = item.getItems({
      class: paper.Path,
    }) as Paper.Path[];

    // path 개수 검증: 하나만 있어야 함.
    yield* isSinglePath(paths);

    // alias for convenience
    const path = paths[0];

    // path.curves에 대해 midlinear indexes
    const midLinearIndexes = getMidLinearIndexes(path.curves);

    console.log("midLinearIndexes", midLinearIndexes);

    // midlinear indexes에 대해 2개로 split
    const midLinearSegmentedPathCurves: Paper.Curve[] = path.curves
      .map((curve, index) => {
        if (midLinearIndexes.includes(index)) {
          return getSplitCurves(curve, 2, { toLinear: true });
        } else {
          return [curve];
        }
      })
      .flat();

    console.log("path curves length", path.curves.length);
    console.log(
      "midLinearSegmentedPathCurves length",
      midLinearSegmentedPathCurves.length
    );

    // 최소 길이 계산
    const minLength = getMinLengthFromCurves(midLinearSegmentedPathCurves, {
      onlyLinear: true,
    });

    // midlinear indexes 계산: for segmented path curves
    const segmentedPathCurvesMidLinearIndexes = getMidLinearIndexes(
      midLinearSegmentedPathCurves
    );

    // angle indexes 계산: 해당 index에 해당하는 위치에 roundness corner curve를 삽입예정
    const angleIndexes: number[] = [];
    const angles: number[] = [];

    circularForEach(
      midLinearSegmentedPathCurves,
      (curvesWindow, index) => {
        const angle = getBetweenAngle(curvesWindow[0], curvesWindow[1]);
        if (angle instanceof Error) {
          return;
        }
        const moduloAngle = circularModulo(angle, 360);
        if (
          [0, 180, 360].some((value) => Math.abs(moduloAngle - value) < 0.001)
        ) {
          return;
        }
        angleIndexes.push(index + 1);
        angles.push(circularModulo(angle, 360));
      },
      2
    );

    console.log("angleIndexes", angleIndexes);
    console.log("angles", angles);

    console.log(
      "segmentedPathCurvesMidLinearIndexes",
      segmentedPathCurvesMidLinearIndexes
    );

    // 실제로 변화시킬 길이
    const referenceLength = (minLength * roundness) / 100;

    const newCurves: Paper.Curve[] = [];

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
        console.log("prevIndex:", prevIndex);
        // path의 진행 방향 중 커브 직후 각도가 있는 경우
        const partCurve = getOffsetCurve(
          _curve,
          _curve.length - referenceLength,
          "end"
        );
        newCurves.push(partCurve);
      } else if (angleIndexes.includes(currentIndex)) {
        // path의 진행 방향 중 커브 직전 각도가 있는 경우
        const partCurve = getOffsetCurve(
          _curve,
          _curve.length - referenceLength,
          "start"
        );
        newCurves.push(partCurve);
      } else {
        console.log("else:", index);
        newCurves.push(_curve);
      }
    });

    const arcCurves: Paper.Curve[] = [];

    const debugNewPoints: Paper.Point[] = [];

    // 각도계산. 본래 변수를 사용하려면 clone을 해야 하나 메모리 관리를 위해 그냥 레퍼런스를 이어가면서 사용
    angleIndexes.forEach((angleIndex) => {
      const vector1Index =
        (angleIndex - 1 + midLinearSegmentedPathCurves.length) %
        midLinearSegmentedPathCurves.length;
      const vector2Index =
        (angleIndex + midLinearSegmentedPathCurves.length) %
        midLinearSegmentedPathCurves.length;

      const primaryPoint = midLinearSegmentedPathCurves[vector2Index].point1;

      const vector1 = midLinearSegmentedPathCurves[vector1Index].segment2.point
        .subtract(midLinearSegmentedPathCurves[vector1Index].segment1.point)
        .normalize();
      const vector2 = midLinearSegmentedPathCurves[vector2Index].segment2.point
        .subtract(midLinearSegmentedPathCurves[vector2Index].segment1.point)
        .normalize();

      const direnctionVector = vector2.add(vector1.multiply(-1)).normalize();

      const betweenAngle = (vector2.angle - vector1.angle + 360) % 360;
      const betweenAngleInRadians = betweenAngle * (Math.PI / 180);

      const multiplier =
        Math.abs(
          1 / Math.cos(betweenAngleInRadians / 2) -
            Math.tan(betweenAngleInRadians / 2)
        ) * referenceLength;

      const arcThrough = primaryPoint.add(
        direnctionVector.multiply(Math.abs(multiplier))
      );

      debugNewPoints.push(arcThrough);

      console.log(
        "direnctionVector",
        angleIndex,
        direnctionVector.length,
        vector1.angle,
        vector2.angle,
        direnctionVector.angle
      );

      const arcFrom = primaryPoint.add(vector1.multiply(-referenceLength));
      const arcTo = primaryPoint.add(vector2.multiply(referenceLength));

      const newArc = new paper.Path.Arc(arcFrom, arcThrough, arcTo);
      newArc.curves.forEach((curve) => {
        arcCurves.push(curve);
      });
    });
    console.log("referenceLength", referenceLength);

    {
      /** DEBUG SCOPE */

      let debugPaths: Paper.Path[] = [];

      // paths의 path에 속한 각 segment에 대해 새로운 path 생성

      const DEBUG_LINE_WIDTH_1 = 10;
      const DEBUG_LINE_WIDTH_2 = 3;

      newCurves.forEach((curve, index) => {
        if (curve.hasHandles()) {
          const newPath = new paper.Path([curve.segment1, curve.segment2]);
          newPath.style.strokeColor = new paper.Color("#FF0000");
          if (index % 2 === 0) {
            newPath.style.strokeWidth = DEBUG_LINE_WIDTH_1;
          } else {
            newPath.style.strokeWidth = DEBUG_LINE_WIDTH_2;
          }
          debugPaths.push(newPath);
        } else {
          const newPath = new paper.Path([curve.segment1, curve.segment2]);
          newPath.style.strokeColor = new paper.Color("#00FF00");
          if (index % 2 === 0) {
            newPath.style.strokeWidth = DEBUG_LINE_WIDTH_1;
          } else {
            newPath.style.strokeWidth = DEBUG_LINE_WIDTH_2;
          }
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

      arcCurves.forEach((curve) => {
        const newPath = new paper.Path([curve.segment1, curve.segment2]);
        newPath.style.strokeColor = new paper.Color("#FFFFFF");
        newPath.style.strokeWidth = DEBUG_LINE_WIDTH_2;
        newPath.style.dashArray = [10, 10];
        debugPaths.push(newPath);
      });

      item.addChildren(debugPaths);
      item.addChildren([firstCurve]);
      item.addChildren(debugNewPointsItems);
      // item.addChildren(debugMidLinearSegmentedPathCurvesPaths);
    }
    // 프로젝트 제거
    paper.project.remove();

    // 반환
    return item;
  });

export const smoothSinglePath = (roundness: number) =>
  provideDependencies(_smoothSinglePath(roundness));
