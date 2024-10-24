import { Effect } from "effect";
import { ProcessTask } from "../types";
import { PaperEngine } from "../../svg-engine/paper-engine";
import type { Paper } from "../../paper";

type ExportPaperItemToSVGElementParams = {
  item: Paper.Item;
  size: {
    width: number;
    height: number;
  };
};

type ExportPaperItemToSVGElementResult = {
  svg: SVGElement;
};

export const exportPaperItemToSVGElement: ProcessTask<
  ExportPaperItemToSVGElementParams,
  ExportPaperItemToSVGElementResult
> = (params: ExportPaperItemToSVGElementParams) =>
  Effect.gen(function* () {
    // 의존성 로드
    const paperEngine = yield* PaperEngine;

    // 환경 설정
    const paper = yield* paperEngine.setup(
      params.size.width,
      params.size.height
    );

    // 작업 수행
    const currentLayer = paper.project.activeLayer;
    currentLayer.addChild(params.item);
    console.log("itemPosition after", params.item.position);
    // params.item.position = itemPosition;

    const exportedSVG = paper.project.exportSVG({
      asString: false,
    }) as SVGElement;

    // 프로젝트 제거
    paper.project.remove();

    // 반환
    return {
      svg: exportedSVG,
    };
  });
