import { Effect, Ref } from "effect";
import { PaperEngine } from "../svg-engine/paper-engine";
import type { Paper } from "../paper/type";
import { SVGProcessorContext } from "../svg-engine/svgProcessor.context";

export const defaultPaperTask = (item: Paper.Item) =>
  Effect.gen(function* () {
    // 의존성 로드
    const { paper } = yield* PaperEngine;

    // 컨텍스트 로드
    const contextRef = yield* SVGProcessorContext;
    const context = yield* Ref.get(contextRef);

    // 환경 설정 (pre task에서만)
    paper.setup([context.displaySize.width, context.displaySize.height]);

    // 작업 수행

    // do something here

    // 프로젝트 제거 (post task에서만)
    paper.project.remove();

    // 반환
    return item;
  });
