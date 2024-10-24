import { Effect } from "effect";
import { ProcessTask } from "./types";
import { PaperEngine } from "../svg-engine/paper-engine";
import type { Paper } from "../paper";
import { provideDependencies } from "../provideDependencies";

type ExpandAllShapeToPathParams = {
  item: Paper.Item;
  size?: {
    width: number;
    height: number;
  };
};

type ExpandAllShapeToPathResult = {
  item: Paper.Item;
};

export const expandAllShapeToPath: ProcessTask<
  ExpandAllShapeToPathParams,
  ExpandAllShapeToPathResult
> = (params: ExpandAllShapeToPathParams) =>
  Effect.gen(function* () {
    // 의존성 로드
    const paperEngine = yield* PaperEngine;

    // 환경 설정
    const paper = yield* paperEngine.setup(
      params.size?.width ?? 1000,
      params.size?.height ?? 1000
    );

    // 작업 수행

    // item 내부의 모든 Shape를 Path로 변환
    const targetShapes = params.item.getItems({
      recursive: true,
      class: paper.Shape,
    }) as Paper.Shape[];

    const convertedPaths: Paper.Path[] = targetShapes.map(
      (shape) => shape.toPath(false) // no insert to active layer
    );

    // 비어있는 패스는 제외
    const filteredConvertedPaths = convertedPaths.filter(
      (shape) => shape.fillColor !== null
    );

    // 기존 Shapes 제거
    targetShapes.forEach((shape) => {
      shape.remove();
    });

    // 변환된 패스 추가
    params.item.addChildren(filteredConvertedPaths);

    // 프로젝트 제거
    paper.project.remove();

    // 반환
    return {
      item: params.item,
    };
  });
