import { Effect } from "effect";
import { ProcessTask } from "./types";
import { PaperEngine } from "../svg-engine/paper-engine";
import type { Paper } from "../paper";

type ScalePaperItemParams = {
  item: Paper.Item;
  scale: number;
  size?: {
    width: number;
    height: number;
  };
};

type ScalePaperItemResult = {
  item: Paper.Item;
  scaledSize: {
    width: number;
    height: number;
  };
};

export const scalePaperItem: ProcessTask<
  ScalePaperItemParams,
  ScalePaperItemResult
> = (params: ScalePaperItemParams) =>
  Effect.gen(function* () {
    // 의존성 로드
    const paperEngine = yield* PaperEngine;
    const itemPosition = params.item.position.clone();

    console.log("itemPosition prev", itemPosition);

    const scaledWidth = (params.size?.width ?? 1000) * params.scale;
    const scaledHeight = (params.size?.height ?? 1000) * params.scale;

    // 환경 설정
    const paper = yield* paperEngine.setup(scaledWidth, scaledHeight);

    // 작업 수행
    params.item.scale(params.scale, params.item.bounds.topLeft);

    const itemPosition2 = params.item.position.clone();

    console.log("itemPosition after", itemPosition2);

    // params.item.position = itemPosition;

    // 프로젝트 제거
    paper.project.remove();

    // 반환
    return {
      item: params.item,
      scaledSize: {
        width: scaledWidth,
        height: scaledHeight,
      },
    };
  });
