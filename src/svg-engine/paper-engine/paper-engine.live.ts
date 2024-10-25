import { Effect, Layer, pipe } from "effect";
import { PaperEngine } from "./paper-engine";
import paper from "paper";
import { Paper } from "../../paper/type";
import { PaperItemManager } from "./paper-item-manager";

export const PaperEngineLive = Layer.succeed(
  PaperEngine,
  (() => {
    const _paper = (() => {
      const newScope = { paper: {} };
      paper.install(newScope);
      console.log("newScope", newScope);
      return newScope.paper as Paper.PaperScope;
    })();
    return {
      paper: _paper,
      paperItemManager: new PaperItemManager(paper),
    };
  })()
);
