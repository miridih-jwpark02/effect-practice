import { Effect } from "effect";
import type { Paper } from "../../paper";

// path 개수 검증
export const isSinglePath = (paths: Paper.Path[]) =>
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
export const getMinLengthFromCurves = (
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
export const getSplitCurves = (
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
export const circularModulo = (index: number, length: number) => {
  if (index >= 0 && index < length) return index;
  return ((index % length) + length) % length;
};

/**
 * 배열의 요소들을 순환하면서 callback을 실행하는 함수
 * @param array - 순환할 배열
 * @param callback - 각 요소에 대해 실행할 callback 함수
 * @param windowSize - 한 번에 처리할 요소의 개수 (기본값: 1)
 */
export const circularForEach = <T>(
  array: T[],
  callback: (items: T[], index: number) => void,
  windowSize: number = 1
): void => {
  if (array.length === 0 || windowSize <= 0) return;

  const len = array.length;
  const window: T[] = new Array(windowSize);

  for (let i = 0; i < len; i++) {
    for (let j = 0; j < windowSize; j++) {
      window[j] = array[(i + j) % len];
    }
    callback(window, i);
  }
};

/**
 * 선형 curve의 각도를 반환하는 함수
 * @param curve - 각도를 반환할 curve
 * @returns 각도
 */
export const getAngleFromLinearCurve = (curve: Paper.Curve) => {
  const directionVector = curve.segment2.point.subtract(curve.segment1.point);
  return (directionVector.angle + 360) % 360;
};

// mid linear: 양쪽 curve가 모두 linear이고 자기 자신도 linear인 경우
export const getMidLinearIndexes = (curves: Paper.Curve[]) => {
  const isMidLinear = (
    prev: Paper.Curve,
    curr: Paper.Curve,
    next: Paper.Curve
  ) => !(prev.hasHandles() || curr.hasHandles() || next.hasHandles());

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
export const getBetweenAngle = (curve1: Paper.Curve, curve2: Paper.Curve) => {
  if (curve1.hasHandles() || curve2.hasHandles()) {
    console.error("curve has handles");
    return new Error("Curve has handles");
  }
  const directionVector1 = getAngleFromLinearCurve(curve1);
  const directionVector2 = getAngleFromLinearCurve(curve2);
  return directionVector2 - directionVector1;
};
