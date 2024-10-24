import { Effect, Layer, pipe } from "effect";
import { PaperEngine } from "./paper-engine";
import paper from "paper";
import { Paper } from "../../paper/type";

export const PaperEngineLive = Layer.succeed(PaperEngine, {
  paper: (() => {
    const newScope = { paper: {} };
    paper.install(newScope);
    console.log("newScope", newScope);
    return newScope.paper as Paper.PaperScope;
  })(),
});
