import { Context, Effect, pipe } from "effect";
import { PaperEngine } from "./pape";
import { Environment } from "../environment";
import { PaperEngineInterface } from "./pape";

const setup: PaperEngineInterface["setup"] = (width: number, height: number) =>
  pipe(
    Environment,
    Effect.andThen((env) => env.paper),
    Effect.andThen((paper) => {
      paper.setup([width, height]);
      return paper;
    })
  );

export const PaperEngineImplementation: Context.Tag.Service<PaperEngine> = {
  setup,
};
