import { Effect, Layer, pipe } from "effect";
import { Environment } from "./environment";
import { EF_DOMParser } from "../core/types";

// 환경 레이어 (Node.js)
export const NodeEnvironmentProvider = Layer.succeed(Environment, {
  domParser: pipe(
    Effect.tryPromise(() => import("jsdom").then(({ JSDOM }) => new JSDOM())),
    Effect.map((jsdom) => new jsdom.window.DOMParser() as EF_DOMParser),
    Effect.catchAll(() => Effect.fail(new Error("Failed to create DOMParser")))
  ),
  document: pipe(
    Effect.tryPromise(() =>
      import("jsdom").then(({ JSDOM }) => new JSDOM().window.document)
    ),
    Effect.catchAll(() => Effect.fail(new Error("Failed to create document")))
  ),
  paper: pipe(
    Effect.tryPromise(() =>
      import("paper-jsdom").then(({ PaperScope }) => new PaperScope())
    ),
    Effect.catchAll(() => Effect.fail(new Error("Failed to create paper")))
  ),
});

// 환경 레이어 (브라우저)
export const BrowserEnvironmentProvider = Layer.succeed(Environment, {
  domParser: Effect.suspend(() =>
    Effect.succeed(new DOMParser() as EF_DOMParser)
  ),
  document: Effect.suspend(() => Effect.succeed(document)),
  paper: pipe(
    Effect.tryPromise(() =>
      import("paper/dist/paper-core").then(({ PaperScope }) => new PaperScope())
    ),
    Effect.tap(() => console.log("loaded paper")),
    Effect.catchAll(() => Effect.fail(new Error("Failed to create paper")))
  ),
});

// 환경에 따른 레이어 선택
export const EnvironmentProvider =
  typeof window === "undefined"
    ? NodeEnvironmentProvider
    : BrowserEnvironmentProvider;
