import { Console, Effect, pipe } from "effect";
import { importSVGToPaperItem } from "./tasks/pre/importSVGToPaperItem";
import { exportPaperItemToSVGElement } from "./tasks/post/exportPaperItemToSVG";
import { scalePaperItem } from "./tasks/scalePaperItem";
import { mergeToSinglePath } from "./tasks/mergeToSinglePath";
import { expandAllShapeToPath } from "./tasks/expandAllShapeToPath";
import { smoothSinglePath } from "./tasks/smoothSinglePath";

import { DependenciesProvider } from "./svg-engine/dependencies.provider";
import { BehaviorSubject } from "rxjs";

const mockSVGString = `<svg width="1241" height="1076" viewBox="0 0 1241 1076" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="455" y="324" width="520" height="685" fill="#5D2626"/>
<rect y="324" width="302.206" height="685" fill="#5D2626"/>
<rect x="938" y="324" width="302.206" height="685" fill="#5D2626"/>
<path d="M158.671 483.329C132.701 469.313 119.954 422.224 130.2 378.154L657.926 58.9712C668.171 14.9012 697.53 -9.46211 723.5 4.55412L958.5 142.5C984.47 156.516 1137.25 98.43 1127 142.5L997.229 612.792C986.983 656.862 957.625 681.225 931.655 667.209L158.671 483.329Z" fill="#D23434"/>
<circle cx="844" cy="926" r="150" fill="#D9D9D9"/>
</svg>
`;

/**
 * SVG 처리 옵션
 */
type SVGOpts = {
  /** SVG string */
  svgString: string;
  /** Scale factor */
  scale?: number;
  /** Roundness */
  roundness?: number;
  /** Resource size */
  resourceSize?: {
    width: number;
    height: number;
  };
};

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
 * SVG 처리 프로그램
 * @param opts - 처리 옵션
 * @returns SVG element를 포함한 Promise
 */
export const createSvgProcessProgram = ({
  svgString,
  scale = 1,
  roundness = 50,
  resourceSize,
}: SVGOpts) =>
  Effect.gen(function* () {
    const performanceResult: PerformanceResult = performanceSubject.getValue();
    const startTotal = performance.now();

    // SVG string을 Paper.js item으로 import
    const start = performance.now();
    const { item, size: importedSize } = yield* importSVGToPaperItem({
      svgString,
      size: resourceSize,
    });
    updatePerformanceStep("importSVGToPaperItem", performance.now() - start);

    // 모든 shape를 path로 확장
    const start2 = performance.now();
    const { item: expanded } = yield* expandAllShapeToPath({
      item,
      size: importedSize,
    });
    updatePerformanceStep("expandAllShapeToPath", performance.now() - start2);

    // 단일 path로 병합
    const start3 = performance.now();
    const { item: merged } = yield* mergeToSinglePath({
      item: expanded,
      size: importedSize,
    });
    updatePerformanceStep("mergeToSinglePath", performance.now() - start3);

    // Path 부드럽게 처리
    const start4 = performance.now();
    const { item: smoothed } = yield* smoothSinglePath({
      item: merged,
      roundness,
      size: importedSize,
    });
    updatePerformanceStep("smoothSinglePath", performance.now() - start4);

    // Path 크기 조정
    const start5 = performance.now();
    const { item: scaled, scaledSize } = yield* scalePaperItem({
      item: smoothed,
      scale,
      size: importedSize,
    });
    updatePerformanceStep("scalePaperItem", performance.now() - start5);

    // Paper.js item을 SVG element로 export
    const start6 = performance.now();
    const { svg } = yield* exportPaperItemToSVGElement({
      item: scaled,
      size: {
        width: scaledSize.width,
        height: scaledSize.height,
      },
    });
    updatePerformanceStep(
      "exportPaperItemToSVGElement",
      performance.now() - start6
    );

    updatePerformanceStep("total", performance.now() - startTotal);

    return { svg, performanceResult };
  });
const runSVGProcess = ({
  svgString,
  scale = 0.5,
  roundness = 50,
  resourceSize,
}: SVGOpts) => {
  console.log("runSVGProcess start");
  return pipe(
    createSvgProcessProgram({ svgString, scale, roundness, resourceSize }),
    Effect.provide(DependenciesProvider),
    Effect.runPromise
  );
};

export class SvgProcessor {
  private readonly _runner = runSVGProcess;
  run = (options: SVGOpts) => this._runner(options);
}

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
