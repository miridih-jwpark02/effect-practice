import { Effect } from "effect";
import { importSVGToPaperItem } from "../tasks/pre/importSVGToPaperItem";
import { expandAllShapeToPath } from "../tasks/expandAllShapeToPath";
import { mergeToSinglePath } from "../tasks/mergeToSinglePath";
import { smoothPaths } from "../tasks/smoothPaths";
import { fitBoundsToDisplaySizePaperItem } from "../tasks/fitBoundsToDisplaySizePaperItem";
import { exportPaperItemToSVGElement } from "../tasks/post/exportPaperItemToSVG";
import { BehaviorSubject } from "rxjs";
import { applyStyleToAllPath } from "../tasks/applyStyleToAllPath";
import { scale } from "../tasks/scale";
import { reposition } from "../tasks/reposition";

export const stretchableTestProgram = Effect.gen(function* () {
  // SVG string을 Paper.js item으로 import
  const start = performance.now();
  const importedItem = yield* importSVGToPaperItem;
  updatePerformanceStep("importSVGToPaperItem", performance.now() - start);

  const start2 = performance.now();
  const expandedItem = yield* expandAllShapeToPath(importedItem);
  updatePerformanceStep("expandAllShapeToPath", performance.now() - start2);

  const start21 = performance.now();
  const repositionedItem = yield* reposition(expandedItem);
  updatePerformanceStep("reposition", performance.now() - start21);

  const start3 = performance.now();
  const mergedItem = yield* mergeToSinglePath(repositionedItem);
  updatePerformanceStep("mergeToSinglePath", performance.now() - start3);

  // const start4 = performance.now();
  // const scaledItem = yield* scale(mergedItem);
  // updatePerformanceStep("scale", performance.now() - start4);

  const start5 = performance.now();
  const smoothedItem = yield* smoothPaths(mergedItem);
  updatePerformanceStep("smoothPaths", performance.now() - start5);

  const start6 = performance.now();
  const styledItem = yield* applyStyleToAllPath(smoothedItem);
  updatePerformanceStep("applyStyleToAllPath", performance.now() - start6);

  const start7 = performance.now();
  const svg = yield* exportPaperItemToSVGElement(styledItem);
  updatePerformanceStep(
    "exportPaperItemToSVGElement",
    performance.now() - start7
  );

  return svg;
});

/**
 * Performance 측정 결과
 */
export type PerformanceResult = {
  /** 각 단계별 실행 시간 (ms) */
  steps: Record<string, number[]>;
  /** 전체 실행 시간 (ms) */
  total: number[];
};

// 실시간 성능 데이터를 저장할 BehaviorSubject
export const performanceSubject = new BehaviorSubject<PerformanceResult>({
  steps: {},
  total: [],
});

/**
 * 성능 데이터 업데이트
 * @param step - 단계 이름
 * @param time - 실행 시간
 */
function updatePerformanceStep(step: string, time: number) {
  const currentPerformance = performanceSubject.getValue();
  if (!currentPerformance.steps[step]) {
    currentPerformance.steps[step] = [];
  }
  currentPerformance.steps[step].push(time);

  // 각 step의 데이터를 최대 100개로 제한
  if (currentPerformance.steps[step].length > 100) {
    currentPerformance.steps[step] = currentPerformance.steps[step].slice(-100);
  }

  if (step === "total") {
    currentPerformance.total.push(time);
    // total 데이터도 최대 100개로 제한
    if (currentPerformance.total.length > 100) {
      currentPerformance.total = currentPerformance.total.slice(-100);
    }
  }

  performanceSubject.next(currentPerformance);
}
