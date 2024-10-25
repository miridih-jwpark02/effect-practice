import { Effect } from "effect";
import type { Paper } from "../../paper/type";

// path 개수 검증
export const isSinglePath = (paths: Paper.Path[]) =>
  paths.length === 0
    ? Effect.fail(new Error("No path to smooth"))
    : paths.length > 1
    ? Effect.fail(new Error("Multiple paths found"))
    : Effect.succeed(true);

/**
 * Path에 NaN 값이 있는지 검증합니다.
 * @param paths - 검증할 Paper.Path 배열
 * @returns NaN 값이 있으면 true, 없으면 false를 반환하는 Effect
 */
export const hasNaNPath = (paths: Paper.Path[]): Effect.Effect<boolean> =>
  Effect.gen(function* (_) {
    const results = yield* _(
      Effect.forEach(
        paths,
        (path) =>
          Effect.succeed(
            path.segments.some(
              (segment) =>
                Number.isNaN(segment.point.x) || Number.isNaN(segment.point.y)
            )
          ),
        { concurrency: 5 } // 5개씩 검증
      )
    );
    return results.some((result) => result);
  });
