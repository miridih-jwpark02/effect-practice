import { Effect } from "effect";
import { PaperEngine } from "../svg-engine/paper-engine";
import type { Paper } from "../paper/type";
import { smoothSinglePath } from "./smoothSinglePath";

export const smoothPaths = (item: Paper.Item) =>
  Effect.gen(function* () {
    // 의존성 로드
    const { paper } = yield* PaperEngine;

    const paths = item.getItems({
      class: paper.Path,
    }) as Paper.Path[];

    console.log("[smoothPaths] paths", paths);
    const smoothedPaths = yield* Effect.all(paths.map(smoothSinglePath));

    item.removeChildren();
    item.addChildren(smoothedPaths);

    // 반환
    return item;
  });
