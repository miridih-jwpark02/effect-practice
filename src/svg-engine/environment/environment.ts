import { Effect, Context } from "effect";
import { EF_DOMParser } from "../core/types";
import { Paper } from "../../paper";

// 환경 의존성 인터페이스
export class Environment extends Context.Tag("Environment")<
  Environment,
  {
    domParser: Effect.Effect<EF_DOMParser, Error, never>;
    document: Effect.Effect<Document, Error, never>;
    paper: Effect.Effect<Paper.PaperScope, Error, never>;
  }
>() {}
