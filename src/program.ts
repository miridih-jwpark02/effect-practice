import { Effect, pipe } from "effect"
import { SVGEngineProvider } from "./svg-engine/engine/engine.provider"
import { EnvironmentProvider } from "./svg-engine/environment/environment.provider"
import { SVGEngine } from "./svg-engine/engine/engine"

// 메인 프로그램 Effect
const program = pipe(
  // SVG 엔진 가져오기
  SVGEngine,
  Effect.flatMap((svgEngine) =>
    pipe(
      Effect.all({
        // 1. 사각형 생성
        rectangle: pipe(
          svgEngine.createElement("rect", { x: 10, y: 10, width: 100, height: 50 }),
          Effect.flatMap(svgEngine.setStyle("fill: blue"))
        ),
        // 2. 원 생성
        circle: pipe(
          svgEngine.createElement("circle", { cx: 50, cy: 50, r: 25 }),
          Effect.flatMap(svgEngine.setStyle("fill: red"))
        )
      }),
      // 3. 그룹 생성 및 도형 추가
      Effect.flatMap((shapes) =>
        pipe(
          svgEngine.createGroup(),
          Effect.flatMap((group) =>
            pipe(
              svgEngine.appendChild(shapes.rectangle)(group),
              Effect.flatMap(svgEngine.appendChild(shapes.circle))
            )
          )
        )
      ),
      // 4. SVG 렌더링
      Effect.flatMap(svgEngine.render),
      // 5. 생성된 SVG 로깅
      Effect.tap((svg) => Effect.sync(() => console.log("Generated SVG:", svg))),
      // 6. SVG 가져오기
      Effect.flatMap(() => svgEngine.importSVG('<svg><rect x="10" y="10" width="100" height="50" fill="green"/></svg>')),
      // 7. 가져온 SVG 렌더링
      Effect.flatMap(svgEngine.render),
      // 8. 가져온 SVG 로깅
      Effect.tap((svg) => Effect.sync(() => console.log("Imported and rendered SVG:", svg)))
    )
  )
)

// 프로그램 실행을 위한 Effect
export const runnable = Effect.provide(program, [SVGEngineProvider, EnvironmentProvider])