import { Effect } from "effect";
import type { Paper } from "../../paper/type";
import { circularForEach } from "./iterate";

/**
 * 최소 길이를 반환하는 함수
 * @param curves - 길이를 비교할 curve들
 * @param options - 옵션
 * @returns Effect로 감싸진 최소 길이
 */
export const getMinLengthFromCurves = (
  curves: Paper.Curve[],
  options: {
    /** linear한 curve만 고려할지 여부 */
    onlyLinear?: boolean;
  } = {}
): Effect.Effect<number, never, never> => {
  return Effect.gen(function* (_) {
    let minLength = Infinity;
    for (const curve of curves) {
      if (options.onlyLinear && curve.hasHandles()) {
        continue;
      }
      yield* Effect.yieldNow();
      minLength = Math.min(minLength, curve.length);
    }
    return minLength;
  });
};

/**
 * 주어진 curve를 주어진 개수만큼 분할하는 함수
 * @param curve - 분할할 curve
 * @param splitCount - 분할할 개수
 * @param options - 옵션
 * @returns Effect로 감싸진 분할된 curve들
 */
export const getSplitCurves = (
  curve: Paper.Curve,
  splitCount: number,
  options?: {
    /** 선형으로 변환할지 여부 */
    toLinear?: boolean;
  }
): Effect.Effect<Paper.Curve[], never, never> => {
  return Effect.gen(function* (_) {
    const result: Paper.Curve[] = [];
    for (let index = 0; index < splitCount; index++) {
      yield* Effect.yieldNow();
      const splittedCurve = curve.getPart(
        index / splitCount,
        (index + 1) / splitCount
      );
      if (options?.toLinear) {
        splittedCurve.clearHandles();
      }
      result.push(splittedCurve);
    }
    return result;
  });
};

/**
 * 선형 curve의 각도를 반환하는 함수
 * @param curve - 각도를 반환할 curve
 * @returns Effect로 감싸진 각도
 */
export const getAngleFromLinearCurve = (
  curve: Paper.Curve
): Effect.Effect<number, never, never> => {
  return Effect.gen(function* (_) {
    yield* Effect.yieldNow();
    const directionVector = curve.segment2.point.subtract(curve.segment1.point);
    return (directionVector.angle + 360) % 360;
  });
};

/**
 * mid linear index들을 반환하는 함수
 * @param curves - 검사할 curve 배열
 * @returns Effect로 감싸진 mid linear index 배열
 */
export const getMidLinearIndexes = (
  curves: Paper.Curve[]
): Effect.Effect<number[], never, never> => {
  return Effect.gen(function* (_) {
    const isMidLinear = (
      prev: Paper.Curve,
      curr: Paper.Curve,
      next: Paper.Curve
    ) => !(prev.hasHandles() || curr.hasHandles() || next.hasHandles());

    const midLinearIndexes: number[] = [];

    yield* Effect.forEach(
      Array.from({ length: curves.length }, (_, i) => i),
      (index) =>
        Effect.gen(function* (_) {
          yield* Effect.yieldNow();
          const prevIndex = (index - 1 + curves.length) % curves.length;
          const nextIndex = (index + 1) % curves.length;
          if (
            isMidLinear(curves[prevIndex], curves[index], curves[nextIndex])
          ) {
            midLinearIndexes.push(index);
          }
        })
    );

    return midLinearIndexes;
  });
};

/**
 * 두 curve 사이의 각도를 반환하는 함수
 * @param curve1 - 첫 번째 curve
 * @param curve2 - 두 번째 curve
 * @returns Effect로 감싸진 각도 (1번 커브에서 2번 커브로 반시계가 +)
 */
export const getBetweenAngle = (
  curve1: Paper.Curve,
  curve2: Paper.Curve
): Effect.Effect<number, Error, never> => {
  return Effect.gen(function* (_) {
    if (curve1.hasHandles() || curve2.hasHandles()) {
      yield* Effect.logError("curve has handles");
      return yield* Effect.fail(new Error("Curve has handles"));
    }

    const directionVector1 = yield* getAngleFromLinearCurve(curve1);
    const directionVector2 = yield* getAngleFromLinearCurve(curve2);

    return directionVector2 - directionVector1;
  });
};
