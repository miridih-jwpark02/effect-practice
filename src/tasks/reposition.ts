import { Effect, Ref } from "effect";
import type { Paper } from "../paper/type";
import { PaperEngine } from "../svg-engine/paper-engine";
import {
  LayerItem,
  SVGProcessorContext,
} from "../svg-engine/svgProcessor.context";

export const reposition = (item: Paper.Item) =>
  Effect.gen(function* () {
    // 의존성 로드
    const { paper } = yield* PaperEngine;

    // 컨텍스트 로드
    const contextRef = yield* SVGProcessorContext;
    const context = yield* Ref.get(contextRef);

    const layerData = context.layerData;

    const scale = context.scale;
    const xScale = typeof scale === "number" ? scale / 100 : scale.x / 100;
    const yScale = typeof scale === "number" ? scale / 100 : scale.y / 100;

    const deltaWidth =
      context.displaySize.width - context.resourceSize.width * xScale;
    const deltaHeight =
      context.displaySize.height - context.resourceSize.height * yScale;

    const filteredChildren = item.children.filter(
      (child) =>
        (child instanceof paper.Group && child.children.length !== 0) ||
        child instanceof paper.Path
    );

    // bind layerData to paths

    console.log(layerData);
    console.log(filteredChildren);

    // 레이어 데이터가 없으면 에러 반환
    if (!layerData) {
      yield* Effect.fail(new Error(`layerData is undefined`));
    }

    // 레이어 데이터와 아이템 자식 수가 일치하지 않으면 에러 반환
    if (layerData && layerData.length !== filteredChildren.length) {
      yield* Effect.fail(
        new Error(`layerData length and item children length mismatch`)
      );
    }

    type ExtendedLayerItem = LayerItem & {
      item: Paper.Item;
    };

    const extendedLayerData: ExtendedLayerItem[] = [];

    layerData?.forEach((layerItem, index) => {
      const targetItem = filteredChildren[index];

      // targetItem.fitBounds(
      //   new paper.Rectangle(
      //     {
      //       x: targetItem.bounds.x * xScale,
      //       y: targetItem.bounds.y * yScale,
      //     },
      //     {
      //       width: targetItem.bounds.width * xScale,
      //       height: targetItem.bounds.height * yScale,
      //     }
      //   )
      // );

      targetItem.scale(xScale, yScale, item.bounds.topLeft);

      targetItem.scale(
        (deltaWidth * layerItem.strain.scale.x + targetItem.bounds.width) /
          targetItem.bounds.width,
        (deltaHeight * layerItem.strain.scale.y + targetItem.bounds.height) /
          targetItem.bounds.height,
        targetItem.bounds.topLeft
      );

      extendedLayerData.push({
        ...layerItem,
        item: filteredChildren[index],
      });
    });

    // 작업 수행

    // do something here

    // 반환
    return item;
  });
