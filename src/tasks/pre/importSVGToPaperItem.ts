import { Effect, Ref } from "effect";

import { PaperEngine } from "../../svg-engine/paper-engine";
import type { Paper } from "../../paper/type";

import { SVGProcessorContext } from "../../svg-engine/svgProcessor.context";

export const _importSVGToPaperItem = (
  paper: Paper.PaperScope,
  svgString: string
) =>
  Effect.gen(function* () {
    return paper.project.importSVG(svgString);
  });

export const importSVGToPaperItem = Effect.gen(function* () {
  // 의존성 로드
  const { paper } = yield* PaperEngine;

  // 컨텍스트 로드
  const contextRef = yield* SVGProcessorContext;
  const context = yield* Ref.get(contextRef);

  console.log("context", context);

  if (!context.paperItem) {
    return yield* Effect.fail(new Error("Use Paper Item Manager"));
  }

  paper.setup([0.1, 0.1]);
  return context.paperItem.clone();
});
