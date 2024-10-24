import { Effect, Ref } from "effect";

import { PaperEngine } from "../../svg-engine/paper-engine";
import type { Paper } from "../../paper/type";

import { SVGProcessorContext } from "../../svg-engine/svgProcessor.context";

export const _importSVGToPaperItem = (
  paper: Paper.PaperScope,
  svgString: string
) =>
  Effect.gen(function* () {
    return paper.project.importSVG(svgString, {
      expandShape: true,
    });
  });

export const importSVGToPaperItem = Effect.gen(function* () {
  // 의존성 로드
  const { paper } = yield* PaperEngine;

  // 컨텍스트 로드
  const context = yield* SVGProcessorContext;
  const params = yield* Ref.get(context);

  // 환경 설정
  paper.setup([params.displaySize.width, params.displaySize.height]);

  // 작업 수행
  const item = yield* _importSVGToPaperItem(paper, params.svgString);

  // 반환
  return item;
});
