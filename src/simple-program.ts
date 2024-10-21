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
    '<svg><rect x="10" y="10" width="100" height="50" fill="green"/></svg>'
  );

  const rectangle = yield* createElement("rect", {
    x: 10,
    y: 10,
    width: 100,
    height: 50,
  });

  const renderedRectangle = yield* appendChild(importedSvg, rectangle);
  const rendered = yield* render(renderedRectangle);
  return rendered;
});

Effect.runPromise(program).then(console.log);
