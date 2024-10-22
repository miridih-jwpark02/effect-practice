import { Layer } from "effect";
import { PaperEngineProvider } from "./paper-engine/paper.provider";
import { EnvironmentProvider } from "./environment/environment.provider";

export const DependenciesProvider = Layer.merge(
  PaperEngineProvider,
  EnvironmentProvider
);
