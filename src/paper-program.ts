import { Effect, pipe } from "effect";
import { importSVGToPaperItem } from "./tasks/importSVGToPaperItem";
import { exportPaperItemToSVGElement } from "./tasks/exportPaperItemToSVG";
import { scalePaperItem } from "./tasks/scalePaperItem";
import { mergeToSinglePath } from "./tasks/mergeToSinglePath";
import { expandAllShapeToPath } from "./tasks/expandAllShapeToPath";
import { smoothSinglePath } from "./tasks/smoothSinglePath";

const mockSVGString = `<svg width="1241" height="993" viewBox="0 0 1241 993" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="455" y="241" width="520" height="685" fill="#5D2626"/>
<rect y="241" width="302.206" height="685" fill="#5D2626"/>
<rect x="938" y="241" width="302.206" height="685" fill="#5D2626"/>
<path d="M175.748 333.606C148.148 330.135 128.587 304.947 132.058 277.348L157.197 77.4515C160.668 49.8516 185.856 30.2912 213.456 33.7622L1000.06 0.80796C1027.66 4.2789 1047.22 29.4668 1043.75 57.0667L1018.61 256.963C1015.14 284.563 989.953 304.123 962.353 300.652L175.748 333.606Z" fill="#D23434"/>
<circle cx="844" cy="843" r="150" fill="#D9D9D9"/>
</svg>
`;

export const program = ({
  scale = 0.5,
  roundness = 50,
}: {
  scale?: number;
  roundness?: number;
}) =>
  pipe(
    importSVGToPaperItem(mockSVGString),
    Effect.andThen(expandAllShapeToPath),
    Effect.andThen(mergeToSinglePath),
    Effect.andThen(smoothSinglePath(roundness)),
    Effect.andThen(scalePaperItem(scale)),
    Effect.andThen(exportPaperItemToSVGElement),
    Effect.runPromise
  );
