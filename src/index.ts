import { Effect, Console } from "effect"

import { runnable } from "./program"

Effect.runPromise(runnable)