import { Effect } from "effect";

import { PaperEngine } from "../../svg-engine/paper-engine";
import type { Paper } from "../../paper";
import { ProcessTask } from "../types";

type ImportSVGToPaperItemParams = {
  svgString: string;
  size?: {
    width: number;
    height: number;
  };
};

type ImportSVGToPaperItemResult = {
  item: Paper.Item;
  size: {
    width: number;
    height: number;
  };
};

export const importSVGToPaperItem: ProcessTask<
  ImportSVGToPaperItemParams,
  ImportSVGToPaperItemResult
> = (params: ImportSVGToPaperItemParams) =>
  Effect.gen(function* () {
    // 의존성 로드
    const paperEngine = yield* PaperEngine;

    // 환경 설정
    const paper = yield* paperEngine.setup(
      params.size?.width ?? 1000,
      params.size?.height ?? 1000
    );

    // 작업 수행
    const item = paper.project.importSVG(params.svgString, {
      expandShape: true,
    });

    // 프로젝트 제거
    paper.project.remove();

    // 반환
    return {
      item,
      size: {
        width: params.size?.width ?? item.bounds.width,
        height: params.size?.height ?? item.bounds.height,
      },
    };
  });
