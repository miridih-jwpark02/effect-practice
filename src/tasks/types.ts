import { Effect } from "effect";
import { PaperEngine } from "../svg-engine/paper-engine";
import { Environment } from "../svg-engine/environment";

export type ProcessTask<Input, Output, T = PaperEngine | Environment> = (
  params: Input
) => Effect.Effect<Output, Error, T>;
