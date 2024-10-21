import { Effect, pipe } from "effect";
import { SVGEngineProvider } from "./svg-engine/engine/engine.provider";
import { EnvironmentProvider } from "./svg-engine/environment/environment.provider";
import { SVGEngine } from "./svg-engine/engine/engine";

// 메인 프로그램
const program = Effect.gen(function* () {
  const engine = yield* SVGEngine;

  // 1. 사각형 생성
  const rectangle = yield* pipe(
    engine.createElement("rect", { x: 10, y: 10, width: 100, height: 50 }),
    Effect.flatMap((element) => engine.setStyle(element, "fill: blue"))
  );

  // 2. 원 생성
  const circle = yield* pipe(
    engine.createElement("circle", { cx: 50, cy: 50, r: 25 }),
    Effect.flatMap((element) => engine.setStyle(element, "fill: red"))
  );

  // 3. 그룹 생성 및 도형 추가
  const group = yield* pipe(
    engine.createElement("g", {}),
    Effect.flatMap((g) => engine.appendChild(g, rectangle)),
    Effect.flatMap((g) => engine.appendChild(g, circle))
  );

  // 6. SVG 가져오기
  const importedSvg = yield* engine.importSVG(
    '<svg><rect x="10" y="10" width="100" height="50" fill="green"/></svg>'
  );

  // 7. 가져온 SVG 선택
  const selectedImportedSvg = yield* engine.select(importedSvg, "rect");

  // 8. 선택된 SVG 추가
  const renderedImportedSvg = yield* engine.appendChild(
    group,
    selectedImportedSvg[0]
  );

  // 9. 렌더링
  const rendered = yield* engine.render(renderedImportedSvg);

  // 10. 렌더링된 SVG 로깅
  yield* Effect.sync(() => console.log("Imported and rendered SVG:", rendered));

  return rendered;
});

// 프로그램 실행을 위한 Effect
export const runnable = Effect.provide(program, [
  SVGEngineProvider,
  EnvironmentProvider,
]);
