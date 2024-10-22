import { Effect, pipe } from "effect";
import { importSVGToPaperItem } from "./tasks/importSVGToPaperItem";
import { exportPaperItemToSVGElement } from "./tasks/exportPaperItemToSVG";
import { scalePaperItem } from "./tasks/scalePaperItem";
import { mergeToSinglePath } from "./tasks/mergeToSinglePath";
import { expandAllShapeToPath } from "./tasks/expandAllShapeToPath";

const mockSVGString = `<svg width="74" height="68" viewBox="0 0 74 68" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="22" width="30" height="68" fill="#5D2626"/>
<rect y="29.8657" width="30" height="68" transform="rotate(-59.5633 0 29.8657)" fill="#D23434"/>
</svg>
`;

export const program = ({ scale = 0.5 }: { scale?: number }) =>
  pipe(
    importSVGToPaperItem(mockSVGString),
    Effect.andThen((item) => scalePaperItem(scale)(item)),
    Effect.andThen(expandAllShapeToPath),
    Effect.andThen(mergeToSinglePath),
    Effect.andThen(exportPaperItemToSVGElement),
    Effect.runPromise
  );
