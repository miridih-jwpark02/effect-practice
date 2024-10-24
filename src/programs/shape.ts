import { Effect, pipe } from "effect";
import { importSVGToPaperItem } from "../tasks/pre/importSVGToPaperItem";
import { expandAllShapeToPath } from "../tasks/expandAllShapeToPath";
import { mergeToSinglePath } from "../tasks/mergeToSinglePath";
import { smoothSinglePath } from "../tasks/smoothSinglePath";
import { fitBoundsToDisplaySizePaperItem } from "../tasks/fitBoundsToDisplaySizePaperItem";
import { exportPaperItemToSVGElement } from "../tasks/post/exportPaperItemToSVG";

export const shapeProgram = pipe(
  importSVGToPaperItem,
  Effect.andThen(expandAllShapeToPath),
  //   Effect.andThen(mergeToSinglePath),
  //   Effect.andThen(smoothSinglePath),
  Effect.andThen(fitBoundsToDisplaySizePaperItem),
  Effect.andThen(exportPaperItemToSVGElement)
);
