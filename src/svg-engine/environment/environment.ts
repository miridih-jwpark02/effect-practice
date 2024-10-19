import { Effect, Context } from "effect"
import { EF_DOMParser } from "../core/types"

// 환경 의존성 인터페이스
export class Environment extends Context.Tag("Environment")<Environment, 
{
  domParser: Effect.Effect<EF_DOMParser, Error, never>
}>() {}

