import { Effect } from "effect";
import { DependenciesProvider } from "./svg-engine/dependencies.provider";
import type { ProcessTask } from "./tasks/types";

export const provideDependencies = <A, E, R = never>(
  task: Effect.Effect<A, E, R>
) => Effect.provide(task, DependenciesProvider);
