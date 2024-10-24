import { Context, Effect } from "effect";
import type { Paper } from "../../paper/type";

export class PaperEngine extends Context.Tag("PaperEngine")<
  PaperEngine,
  {
    paper: Paper.PaperScope;
  }
>() {}
