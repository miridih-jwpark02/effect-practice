import { Effect } from "effect";
import { DependenciesProvider } from "./svg-engine/dependencies.provider";
import type { ProcessTask } from "./tasks/types";

export const provideDependencies =
  <T, R>(task: ProcessTask<T, R>) =>
  (params: T) =>
    Effect.provide(task(params), DependenciesProvider);
