import { Effect, Ref } from "effect";
import { PaperEngine } from "../../svg-engine/paper-engine";
import type { Paper } from "../../paper/type";
import { SVGProcessorContext } from "../../svg-engine/svgProcessor.context";

export const detectSharpPoint = (item: Paper.Item) =>
  Effect.gen(function* () {
    // 의존성 로드
    const { paper } = yield* PaperEngine;

    // 작업 수행

    const points =
      // do something here

      // 프로젝트 제거 (post task에서만)
      paper.project.remove();

    // 반환
    return;
  });
