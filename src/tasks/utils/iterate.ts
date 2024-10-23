import { Effect } from "effect";

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
 * 배열의 요소들을 순환하면서 effect를 실행하는 함수
 * @param array - 순환할 배열
 * @param effect - 각 요소에 대해 실행할 effect 함수
 * @param windowSize - 한 번에 처리할 요소의 개수 (기본값: 1)
 * @returns Effect<never, never, void>
 */
export const circularForEach = <T, R, E>(
  array: T[],
  effect: (items: T[], index: number) => Effect.Effect<void, E, R>,
  windowSize: number = 1
): Effect.Effect<void, E, R> => {
  if (array.length === 0 || windowSize <= 0) {
    return Effect.succeed(undefined);
  }

  const len = array.length;
  const window: T[] = new Array(windowSize);

  return Effect.gen(function* (_) {
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < windowSize; j++) {
        window[j] = array[(i + j) % len];
      }
      yield* effect(window, i);
    }
  });
};
