import { Effect as _, Layer, pipe } from "effect"
import { Environment } from "./environment"
import { EF_DOMParser } from "../core/types"

// 환경 레이어 (Node.js)
export const NodeEnvironmentProvider = Layer.succeed(
  Environment,
  {
    domParser: pipe(
      _.tryPromise(() => import('jsdom').then(({ JSDOM }) => new JSDOM())),
      _.map((jsdom) => new jsdom.window.DOMParser() as EF_DOMParser),
      _.catchAll(() => _.fail(new Error('Failed to create DOMParser')))
    )
  }
)

// 환경 레이어 (브라우저)
export const BrowserEnvironmentProvider = Layer.succeed(
  Environment,
  {
    domParser: _.suspend(() => _.succeed(new DOMParser() as EF_DOMParser))
  }
)

// 환경에 따른 레이어 선택
export const EnvironmentProvider = typeof window === 'undefined' ? NodeEnvironmentProvider : BrowserEnvironmentProvider
