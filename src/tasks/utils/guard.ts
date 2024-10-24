import { Effect } from "effect";
import type { Paper } from "../../paper/type";

// path 개수 검증
export const isSinglePath = (paths: Paper.Path[]) =>
  paths.length === 0
    ? Effect.fail(new Error("No path to smooth"))
    : paths.length > 1
    ? Effect.fail(new Error("Multiple paths found"))
    : Effect.succeed(true);
