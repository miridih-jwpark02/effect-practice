import { Effect, Layer, pipe } from "effect"
import { Environment } from "./environment"
import { EF_DOMParser } from "../core/types"

// 환경 레이어 (Node.js)
export const NodeEnvironmentProvider = Layer.succeed(
  Environment,
  {
    domParser: pipe(
      Effect.tryPromise(() => import('jsdom').then(({ JSDOM }) => new JSDOM())),
      Effect.map((jsdom) => new jsdom.window.DOMParser() as EF_DOMParser),
      Effect.catchAll(() => Effect.fail(new Error('Failed to create DOMParser')))
    )
  }
)

// 환경 레이어 (브라우저)
export const BrowserEnvironmentProvider = Layer.succeed(
  Environment,
  {
    domParser: Effect.succeed(new DOMParser() as EF_DOMParser)
  }
)

// 환경에 따른 레이어 선택
export const EnvironmentProvider = typeof window === 'undefined' ? NodeEnvironmentProvider : BrowserEnvironmentProvider
