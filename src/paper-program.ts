import { Effect, Layer, Ref } from "effect";
import { PaperEngine, PaperEngineLive } from "./svg-engine/paper-engine";
import {
  SVGProcessorContext,
  SVGProcessorContextData,
} from "./svg-engine/svgProcessor.context";

// export const _svgProcessProgram = Effect.gen(function* () {
//   const performanceResult: PerformanceResult = performanceSubject.getValue();
//   const startTotal = performance.now();

//   // SVG string을 Paper.js item으로 import
//   const start = performance.now();
//   const { size: importedSize } = yield* importSVGToPaperItem;
//   updatePerformanceStep("importSVGToPaperItem", performance.now() - start);

//   // 모든 shape를 path로 확장
//   const start2 = performance.now();
//   const { item: expanded } = yield* expandAllShapeToPath;
//   updatePerformanceStep("expandAllShapeToPath", performance.now() - start2);

//   // 단일 path로 병합
//   const start3 = performance.now();
//   const { item: merged } = yield* mergeToSinglePath({
//     item: expanded,
//     size: importedSize,
//   });
//   updatePerformanceStep("mergeToSinglePath", performance.now() - start3);

//   // Path 부드럽게 처리
//   const start4 = performance.now();
//   const { item: smoothed } = yield* smoothSinglePath({
//     item: merged,
//     roundness,
//     size: resourceSize,
//   });
//   updatePerformanceStep("smoothSinglePath", performance.now() - start4);

//   // Path 크기 조정
//   const start5 = performance.now();
//   const { item: scaled, scaledSize } = yield* scalePaperItem({
//     item: smoothed,
//     scale,
//     size: resourceSize,
//   });
//   updatePerformanceStep("scalePaperItem", performance.now() - start5);

//   // Paper.js item을 SVG element로 export
//   const start6 = performance.now();
//   const { svg } = yield* exportPaperItemToSVGElement({
//     item: scaled,
//     size: {
//       width: scaledSize.width,
//       height: scaledSize.height,
//     },
//   });
//   updatePerformanceStep(
//     "exportPaperItemToSVGElement",
//     performance.now() - start6
//   );

//   updatePerformanceStep("total", performance.now() - startTotal);

//   return { svg, performanceResult };
// });

// const svgProcessProgram = pipe(
//   importSVGToPaperItem,
//   Effect.tap(),
//   Effect.andThen(expandAllShapeToPath),
//   Effect.tapErrorCause(Console.error),
//   Effect.andThen(mergeToSinglePath),
//   Effect.tapErrorCause(Console.error),
//   Effect.andThen(smoothSinglePath),
//   Effect.tapErrorCause(Console.error),
//   Effect.andThen(scalePaperItem),
//   Effect.tapErrorCause(Console.error),
//   Effect.andThen(exportPaperItemToSVGElement)
// );

/**
 * SVG 처리를 위한 singleton class
 */
export class SvgProcessor {
  private animationFrameId: number | null = null;

  /**
   * SVG 처리를 실행하되, requestAnimationFrame을 사용하여 debounce 적용
   * @param {SVGProcessorContextData} options - SVG 처리 옵션
   * @param {Effect.Effect<{ svg: SVGElement }, never>} program - SVG 처리 프로그램
   * @returns {Promise<{ svg: SVGElement }>} 처리된 SVG 결과
   */
  public run = (
    options: SVGProcessorContextData,
    program: Effect.Effect<SVGElement, Error, SVGProcessorContext | PaperEngine>
  ): Promise<SVGElement> => {
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
