import { Effect, pipe } from "effect";
import { Effect } from "effect/Effect";

export type ProcessUnit<I, O, out R = any> = (input: I) => Effect<O, never, R>;

type InferInput<T> = T extends ProcessUnit<infer I, any> ? I : never;
type InferOutput<T> = T extends ProcessUnit<any, infer O> ? O : never;

type ComposeTwo<
  A extends ProcessUnit<any, any>,
  B extends ProcessUnit<any, any>
> = A extends ProcessUnit<infer AI, infer AO>
  ? B extends ProcessUnit<AO, infer BO>
    ? ProcessUnit<AI, BO>
    : never
  : never;

type ComposeArray<T extends ProcessUnit<any, any>[]> = T extends []
  ? never
  : T extends [ProcessUnit<infer I, infer O>]
  ? ProcessUnit<I, O>
  : T extends [
      infer First extends ProcessUnit<any, any>,
      ...infer Rest extends ProcessUnit<any, any>[]
    ]
  ? ComposeTwo<First, ComposeArray<Rest>>
  : never;

type ComposeArrayResult<T extends ProcessUnit<any, any>[]> = ComposeArray<T>;

function composeProcess<
  A extends ProcessUnit<any, any>,
  B extends ProcessUnit<any, any>
>(a: A, b: B): ComposeTwo<A, B> {
  return ((input: any) => pipe(a(input), Effect.flatMap(b))) as ComposeTwo<
    A,
    B
  >;
}

type Increment<T extends number> = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20
][T];

type ValidateComposition<
  T extends ProcessUnit<any, any>[],
  Index extends number = 0
> = T extends []
  ? []
  : T extends [ProcessUnit<infer I, infer O>]
  ? [ProcessUnit<I, O>]
  : T extends [
      infer First extends ProcessUnit<any, any>,
      infer Second extends ProcessUnit<any, any>,
      ...infer Rest extends ProcessUnit<any, any>[]
    ]
  ? InferOutput<First> extends InferInput<Second>
    ? [First, ...ValidateComposition<[Second, ...Rest], Increment<Index>>]
    : never
  : never;

/**
 * 여러 개의 ProcessUnit을 연결하는 함수
 * @param unitArr 연결할 ProcessUnit 배열
 * @returns 연결된 ProcessUnit
 */
export function composeProcessArray<T extends ProcessUnit<any, any>[]>(
  ...unitArr: T & (ValidateComposition<T> extends never ? never : T)
): ComposeArrayResult<T> {
  return unitArr.reduce((acc, curr) =>
    composeProcess(acc, curr)
  ) as ComposeArrayResult<T>;
}

/**
 * ProcessUnit을 생성하는 함수
 * @param fn 생성할 ProcessUnit의 함수
 * @returns ProcessUnit
 */
export function createProcessUnit<I, O>(
  fn: (input: I) => Effect<O>
): ProcessUnit<I, O> {
  return fn;
}
