import { Layer } from "effect";
import { PaperEngine } from "./pape";
import { PaperEngineImplementation } from "./pape.implementation";

export const PaperEngineProvider = Layer.succeed(
  PaperEngine,
  PaperEngineImplementation
);
