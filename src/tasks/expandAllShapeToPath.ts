import { Effect } from "effect";
import { PaperEngine } from "../svg-engine/paper-engine";
import type { Paper } from "../paper/type";

export const expandAllShapeToPath = (item: Paper.Item) =>
  Effect.gen(function* () {
    // 의존성 로드
    const { paper } = yield* PaperEngine;

    // item 내부의 모든 Shape를 Path로 변환
    const targetShapes = item.getItems({
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
    item.addChildren(filteredConvertedPaths);

    // project clear
    paper.project.clear();

    // 반환
    return item;
  });
