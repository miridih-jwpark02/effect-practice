import { Effect, pipe } from "effect";
import { importSVGToPaperItem } from "./tasks/importSVGToPaperItem";
import { exportPaperItemToSVGElement } from "./tasks/exportPaperItemToSVG";
import { scalePaperItem } from "./tasks/scalePaperItem";
import { mergeToSinglePath } from "./tasks/mergeToSinglePath";
import { expandAllShapeToPath } from "./tasks/expandAllShapeToPath";
import { smoothSinglePath } from "./tasks/smoothSinglePath";

import { DependenciesProvider } from "./svg-engine/dependencies.provider";

const mockSVGString = `<svg width="686" height="685" viewBox="0 0 686 685" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="192" width="302.206" height="685" fill="#5D2626"/>
<rect x="685.603" y="191.397" width="302.206" height="685" transform="rotate(90 685.603 191.397)" fill="#5D2626"/>
<circle cx="493.5" cy="191.5" r="92.5" fill="#D9D9D9"/>
<circle cx="558.5" cy="249.5" r="92.5" fill="#D9D9D9"/>
</svg>
`;

/**
 * SVG 처리 옵션
 */
type SVGOpts = {
  /** Scale factor */
  scale?: number;
  /** Roundness */
  roundness?: number;
};

/**
 * SVG 처리 프로그램
 * @param opts - 처리 옵션
 * @returns SVG element를 포함한 Promise
 */
export const createSvgProcessProgram = ({
  scale = 0.5,
  roundness = 50,
}: SVGOpts) =>
  Effect.gen(function* () {
    // SVG string을 Paper.js item으로 import
    const item = yield* importSVGToPaperItem(mockSVGString);

    // 모든 shape를 path로 확장
    const expanded = yield* expandAllShapeToPath(item);

    // 단일 path로 병합
    const merged = yield* mergeToSinglePath(expanded);

    // Path 부드럽게 처리
    const smoothed = yield* smoothSinglePath(roundness)(merged);

    // Path 크기 조정
    const scaled = yield* scalePaperItem(scale)(smoothed);

    // Paper.js item을 SVG element로 export
    const svg = yield* exportPaperItemToSVGElement(scaled);

    return svg;
  });

const runSVGProcess = ({ scale = 0.5, roundness = 50 }: SVGOpts) => {
  console.log("runSVGProcess start");
  return pipe(
    createSvgProcessProgram({ scale, roundness }),
    Effect.provide(DependenciesProvider),
    Effect.runPromise
  );
};

export class SvgProcessor {
  private readonly _runner = runSVGProcess;
  run = (options: SVGOpts) => this._runner(options);
}
