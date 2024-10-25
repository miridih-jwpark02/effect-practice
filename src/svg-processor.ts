import { Effect, Ref } from "effect";
import { PaperEngine, PaperEngineLive } from "./svg-engine/paper-engine";
import {
  SVGProcessorContext,
  SVGProcessorContextData,
} from "./svg-engine/svgProcessor.context";
import { Paper } from "./paper/type";

/**
 * SVG processing을 담당하는 클래스
 *
 * @remarks
 * 이 클래스는 SVG 처리 작업을 debounce하여 실행합니다.
 * requestAnimationFrame을 사용하여 performance를 최적화합니다.
 * PaperItemManager를 사용하여 동일한 SVG에 대한 중복 처리를 선택적으로 방지합니다.
 */
export class SvgProcessor {
  /** requestAnimationFrame ID */
  private animationFrameId: number | null = null;

  /**
   * SVG 처리를 실행하되, requestAnimationFrame을 사용하여 debounce 적용
   * @param {Exclude<SVGProcessorContextData, "paperItem"> & { useCache: boolean }} options - SVG 처리 옵션
   * @param {Effect.Effect<SVGElement, Error, SVGProcessorContext | PaperEngine>} program - SVG 처리 프로그램
   * @returns {Promise<SVGElement>} 처리된 SVG 결과
   */
  public run = (
    options: Omit<SVGProcessorContextData, "debug"> & {
      svgString: string;
      useCache: boolean;
      debug?: boolean;
    },
    program: Effect.Effect<SVGElement, Error, SVGProcessorContext | PaperEngine>
  ): Promise<SVGElement> => {
    return new Promise((resolve) => {
      if (this.animationFrameId !== null) {
        cancelAnimationFrame(this.animationFrameId);
      }

      this.animationFrameId = requestAnimationFrame(() => {
        const runnable = Effect.gen(function* (_) {
          const paperEngine = yield* _(PaperEngine);
          const paperItem = paperEngine.paperItemManager.getOrCreateItem(
            options.svgString,
            options.useCache
          );

          const initialContext = yield* _(
            Ref.make<SVGProcessorContextData>({
              displaySize: options.displaySize,
              resourceSize: options.resourceSize,
              roundness: options.roundness,
              paperItem,
              debug: options.debug ?? false,
            })
          );

          return yield* _(
            Effect.provideService(program, SVGProcessorContext, initialContext)
          );
        });

        Effect.runPromise(Effect.provide(runnable, PaperEngineLive)).then(
          resolve
        );
      });
    });
  };
}

/**
 * SVG string에서 <svg> 태그와 그 내용을 추출
 * @param rawString - SVG string이 포함된 문자열
 * @returns SVG 태그와 그 내용을 포함한 문자열
 */
const extractPureSVGString = (rawString: string): string | Error => {
  const svgRegex = /<svg[\s\S]*?<\/svg>/i;
  const match = rawString.match(svgRegex);
  return match ? match[0] : new Error("No SVG found");
};
