import { Context, Effect } from "effect";
import type { Paper } from "../../paper/type";
import { PaperItemManager } from "./paper-item-manager";

export class PaperEngine extends Context.Tag("PaperEngine")<
  PaperEngine,
  {
    /** Paper scope */
    paper: Paper.PaperScope;
    /** PaperItemManager instance */
    paperItemManager: PaperItemManager;
  }
>() {}
