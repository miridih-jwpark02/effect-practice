import { Effect, pipe } from "effect";
import { SVGEngine, SVGEngineShape } from "./svg-engine/engine/engine";
import { EF_SVGElement } from "./svg-engine/core/types";
import { SVGEngineProvider } from "./svg-engine/engine/engine.provider";
import { EnvironmentProvider } from "./svg-engine/environment/environment.provider";

// const createProgram = pipe;

const createProgram = Effect.gen;

/**
 * SVGEngine operation을 실행하는 utility function
 * @param operation - SVGEngine에서 실행할 operation
 * @returns Effect로 wrapping된 operation 결과
 */
const runSVGEngineOperation = <A, E, R>(
  operation: (engine: SVGEngineShape) => Effect.Effect<A, E, R>
) =>
  Effect.provide(pipe(SVGEngine, Effect.flatMap(operation)), [
    SVGEngineProvider,
    EnvironmentProvider,
  ]);

const importSVG = (svgString: string) =>
  runSVGEngineOperation((engine) => engine.importSVG(svgString));

/**
 * SVG element를 생성
 * @param args - createElement의 parameters
 * @returns 생성된 SVG element
 */
const createElement = (...args: Parameters<SVGEngineShape["createElement"]>) =>
  runSVGEngineOperation((engine) => engine.createElement(...args));

/**
 * SVG element에 style 적용
 * @param style - 적용할 style string
 * @returns style이 적용된 SVG element를 반환하는 function
 */
const setStyle = (style: string) => (element: EF_SVGElement) =>
  runSVGEngineOperation((engine) => engine.setStyle(element, style));

const appendChild = (element: EF_SVGElement, child: EF_SVGElement) =>
  runSVGEngineOperation((engine) => engine.appendChild(element, child));

/**
 * SVG element를 rendering
 * @param element - rendering할 SVG element
 * @returns rendering 결과
 */
const render = (element: EF_SVGElement) =>
  runSVGEngineOperation((engine) => engine.render(element));

const program = createProgram(function* () {
  const importedSvg = yield* importSVG(
    `<svg width="147" height="147" viewBox="0 0 147 147" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_88_1108)">
<path d="M73.5 147C114.093 147 147 114.093 147 73.5C147 32.9071 114.093 0 73.5 0C32.9071 0 0 32.9071 0 73.5C0 114.093 32.9071 147 73.5 147Z" fill="#FCBA02"/>
<path d="M103.765 36.2149C87.5416 32.1695 73.5002 50.6915 73.5002 50.6915C73.5002 50.6915 59.4587 32.1695 43.2358 36.2149C27.0129 40.2604 14.3415 57.6769 31.2935 87.1886C42.8713 107.345 64.886 121.263 73.5002 124.915C82.1144 121.263 104.135 107.345 115.707 87.1886C132.659 57.6769 119.987 40.2662 103.765 36.2149Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_88_1108">
<rect width="147" height="147" fill="white"/>
</clipPath>
</defs>
</svg>

`
  );

  const rectangle = yield* createElement("rect", {
    x: 20,
    y: 10,
    width: 500,
    height: 100,
  });

  const renderedRectangle = yield* appendChild(importedSvg, rectangle);
  const rendered = yield* render(renderedRectangle);
  return rendered;
});

Effect.runPromise(program).then(console.log);
