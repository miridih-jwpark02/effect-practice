import { Effect, pipe } from "effect";
import { importSVGToPaperItem } from "./tasks/importSVGToPaperItem";
import { exportPaperItemToSVGElement } from "./tasks/exportPaperItemToSVG";
import { scalePaperItem } from "./tasks/scalePaperItem";
import { mergeToSinglePath } from "./tasks/mergeToSinglePath";
import { expandAllShapeToPath } from "./tasks/expandAllShapeToPath";
import { smoothSinglePath } from "./tasks/smoothSinglePath";

const mockSVGString = `<svg width="1241" height="752" viewBox="0 0 1241 752" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="454.618" width="302.206" height="685" fill="#5D2626"/>
<rect width="302.206" height="685" fill="#5D2626"/>
<rect x="938" width="302.206" height="685" fill="#5D2626"/>
<path d="M188.249 447.849C161.435 440.445 145.701 412.705 153.105 385.892L206.731 191.689C214.136 164.875 241.875 149.141 268.689 156.545L1051.86 237.062C1078.67 244.466 1094.4 272.205 1087 299.019L1033.37 493.222C1025.97 520.035 998.23 535.77 971.417 528.366L188.249 447.849Z" fill="#D23434"/>
<circle cx="844" cy="602" r="150" fill="#D9D9D9"/>
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
