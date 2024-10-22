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
      const index = (i + j) % array.length;
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

// mid linear: 양쪽 curve가 모두 linear인 경우
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
        if (angle instanceof Error || (angle + 360) % 180 === 0) {
          return;
        }
        angleIndexes.push(index + 1);
        angles.push((angle + 360) % 360);
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

    midLinearSegmentedPathCurves.forEach((curve, index) => {
      if (angleIndexes.includes(index)) {
        const partCurve = curve.getPart(referenceLength / curve.length, 1);
        newCurves.push(partCurve);
      } else if (angleIndexes.includes(index + 1)) {
        const partCurve = curve.getPart(0, 1 - referenceLength / curve.length);
        newCurves.push(partCurve);
      } else {
        newCurves.push(curve);
      }
    });

    const arcCurves: Paper.Curve[] = [];

    {
      /** DEBUG SCOPE */

      let debugPaths: Paper.Path[] = [];

      // paths의 path에 속한 각 segment에 대해 새로운 path 생성

      const DEBUG_LINE_WIDTH_1 = 10;
      const DEBUG_LINE_WIDTH_2 = 3;

      // midLinearSegmentedPathCurves.forEach((curve, index) => {
      newCurves.forEach((curve, index) => {
        // if (angleIndexes.includes(index) || angleIndexes.includes(index + 1)) {
        //   const newPath = new paper.Path([curve.segment1, curve.segment2]);
        //   newPath.style.strokeColor = new paper.Color("#FFFFFF");
        //   newPath.style.strokeWidth = DEBUG_LINE_WIDTH_2;
        //   debugPaths.push(newPath);
        //   return;
        // }
        if (curve.hasHandles()) {
          const newPath = new paper.Path([curve.segment1, curve.segment2]);
          newPath.style.strokeColor = new paper.Color("#FF0000");
          newPath.style.strokeWidth = DEBUG_LINE_WIDTH_2;
          debugPaths.push(newPath);
        } else {
          const newPath = new paper.Path([curve.point1, curve.point2]);
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

      item.addChildren(debugPaths);
      item.addChildren([firstCurve]);
      // item.addChildren(debugMidLinearSegmentedPathCurvesPaths);
    }
    // 프로젝트 제거
    paper.project.remove();

    // 반환
    return item;
  });

export const smoothSinglePath = (roundness: number) =>
  provideDependencies(_smoothSinglePath(roundness));
