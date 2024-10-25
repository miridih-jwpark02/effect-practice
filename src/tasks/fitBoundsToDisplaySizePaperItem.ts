import { Effect, Ref } from "effect";
import type { Paper } from "../paper/type";
import { SVGProcessorContext } from "../svg-engine/svgProcessor.context";

export const fitBoundsToDisplaySizePaperItem = (item: Paper.Item) =>
  Effect.gen(function* () {
    // 컨텍스트 로드
    const contextRef = yield* SVGProcessorContext;
    const context = yield* Ref.get(contextRef);

    // 스케일 계산
    const xScale = context.displaySize.width / context.resourceSize.width;
    const yScale = context.displaySize.height / context.resourceSize.height;
    // 작업 수행
    item.scale(xScale, yScale, item.bounds.topLeft);

    // 반환
    return item;
  });
