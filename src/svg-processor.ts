import { Effect, Ref } from "effect";
import { PaperEngine, PaperEngineLive } from "./svg-engine/paper-engine";
import {
  SVGProcessorContext,
  SVGProcessorContextData,
} from "./svg-engine/svgProcessor.context";

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
    options: Omit<SVGProcessorContextData, "paperItem"> & { useCache: boolean },
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
              ...options,
              paperItem,
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
