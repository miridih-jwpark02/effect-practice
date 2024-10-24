import { Effect } from "effect";
import { PaperEngine } from "../../svg-engine/paper-engine";
import type { Paper } from "../../paper/type";

export const exportPaperItemToSVGElement = (item: Paper.Item) =>
  Effect.gen(function* () {
    // 의존성 로드
    const { paper } = yield* PaperEngine;

    // 작업 수행
    const currentLayer = paper.project.activeLayer;
    currentLayer.addChild(item);

    const exportedSVG = paper.project.exportSVG({
      asString: false,
    }) as SVGElement;

    // 프로젝트 제거
    paper.project.remove();

    // 반환
    return exportedSVG;
  });
