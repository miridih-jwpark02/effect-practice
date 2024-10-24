import { Effect, Ref } from "effect";
import { PaperEngine, PaperEngineLive } from "./svg-engine/paper-engine";
import {
  SVGProcessorContext,
  SVGProcessorContextData,
} from "./svg-engine/svgProcessor.context";

/**
 * SVG 처리를 위한 singleton class
 */
export class SvgProcessor {
  private static animationFrameId: number | null = null;

  /**
   * SVG 처리를 실행하되, requestAnimationFrame을 사용하여 debounce 적용
   * @param {SVGProcessorContextData} options - SVG 처리 옵션
   * @param {Effect.Effect<{ svg: SVGElement }, never>} program - SVG 처리 프로그램
   * @returns {Promise<{ svg: SVGElement }>} 처리된 SVG 결과
   */
  public static run = (
    options: SVGProcessorContextData,
    program: Effect.Effect<
      { svg: SVGElement },
      Error,
      SVGProcessorContext | PaperEngine
    >
  ): Promise<{ svg: SVGElement }> => {
    return new Promise((resolve) => {
      if (this.animationFrameId !== null) {
        cancelAnimationFrame(this.animationFrameId);
      }

      this.animationFrameId = requestAnimationFrame(() => {
        const initialContext = Ref.make<SVGProcessorContextData>({
          svgString: options.svgString,
          roundness: options.roundness ?? 50,
          resourceSize: options.resourceSize ?? { width: 1000, height: 1000 },
          displaySize: options.displaySize ?? { width: 1000, height: 1000 },
        });

        const runnable = Effect.provideServiceEffect(
          program,
          SVGProcessorContext,
          initialContext
        );

        Effect.runPromise(Effect.provide(runnable, PaperEngineLive)).then(
          resolve
        );
      });
    });
  };
}
