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

  if (context.paperItem) {
    paper.setup([0.1, 0.1]);
    return context.paperItem.clone();
  }

  // 작업 수행
  const item = paper.project.importSVG(context.svgString);
  console.log("first import: layer bounds", paper.project.activeLayer.bounds);

  // 아이템 초기 위치정보 저장
  item.data = {
    itemBounds: item.bounds,
  };

  console.log("context.resourceSize", context.resourceSize);
  console.log("import:itembounds:", item.bounds);

  // 반환
  return item;
});
