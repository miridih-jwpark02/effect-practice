import { Context, Effect } from "effect";
import { Paper } from "../../paper";
import { Environment } from "../environment";

export class PaperEngine extends Context.Tag("PaperEngine")<
  PaperEngine,
  {
    setup: (
      width: number,
      height: number
    ) => Effect.Effect<Paper.PaperScope, Error, Environment>;
  }
>() {}

export type PaperEngineInterface = Context.Tag.Service<PaperEngine>;
