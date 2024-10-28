import { Effect, Ref } from "effect";
import type { Paper } from "../paper/type";
import { SVGProcessorContext } from "../svg-engine/svgProcessor.context";
import { PaperEngine } from "../svg-engine/paper-engine";

export const scale = (item: Paper.Item) =>
  Effect.gen(function* () {
    // 의존성 로드
    const { paper } = yield* PaperEngine;

    // 컨텍스트 로드
    const contextRef = yield* SVGProcessorContext;
    const context = yield* Ref.get(contextRef);

    // 스케일 로드
    const scale = context.scale;
    const xScale = typeof scale === "number" ? scale / 100 : scale.x / 100;
    const yScale = typeof scale === "number" ? scale / 100 : scale.y / 100;

    // scale의 기준점을 아이템의 왼쪽 위로 설정
    item.pivot = item.bounds.topLeft;

    // scale 작업
    item.scale(xScale, yScale, item.bounds.topLeft);

    // 위치 재조정: 최초 위치가 (0,0)이 아니므로 export 시 오차가 발생할 수 있음
    // - 최초 위치에 대한 보정은 최초 위치에 대한 scale 값을 곱하는 것으로 수행
    item.position = item.position.transform(
      new paper.Matrix(xScale, 0, 0, yScale, 0, 0)
    );

    // 반환
    return item;
  });
