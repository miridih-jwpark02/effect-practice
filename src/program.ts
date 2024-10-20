import { Effect, pipe } from "effect"
import { SVGEngineProvider } from "./svg-engine/engine/engine.provider"
import { EnvironmentProvider } from "./svg-engine/environment/environment.provider"
import { SVGEngine } from "./svg-engine/engine/engine"

// 메인 프로그램
const program = Effect.gen(function* () {
  const svgEngine = yield* SVGEngine

  // 1. 사각형 생성
  const rectangle = yield* pipe(
    svgEngine.createElement("rect", { x: 10, y: 10, width: 100, height: 50 }),
    Effect.flatMap(svgEngine.setStyle("fill: blue"))
  )

  // 2. 원 생성
  const circle = yield* pipe(
    svgEngine.createElement("circle", { cx: 50, cy: 50, r: 25 }),
    Effect.flatMap(svgEngine.setStyle("fill: red"))
  )

  // 3. 그룹 생성 및 도형 추가
  const group = yield* svgEngine.createGroup()
  yield* svgEngine.appendChild(rectangle)(group)
  yield* svgEngine.appendChild(circle)(group)

  // 4. SVG 렌더링
  const generatedSvg = yield* svgEngine.render(group)

  // 5. 생성된 SVG 로깅
  yield* Effect.sync(() => console.log("Generated SVG:", generatedSvg))

  // 6. SVG 가져오기
  const importedSvg = yield* svgEngine.importSVG('<svg><rect x="10" y="10" width="100" height="50" fill="green"/></svg>')

  // 7. 가져온 SVG 렌더링
  const renderedImportedSvg = yield* svgEngine.render(importedSvg)

  // 8. 가져온 SVG 로깅
  yield* Effect.sync(() => console.log("Imported and rendered SVG:", renderedImportedSvg))

  return renderedImportedSvg
})

// 프로그램 실행을 위한 Effect
export const runnable = Effect.provide(program, [SVGEngineProvider, EnvironmentProvider])