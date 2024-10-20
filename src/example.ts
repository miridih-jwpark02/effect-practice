import { SVG as kami } from "./svg-engine/engine/engine-wrapper";
import { EnvironmentProvider } from "./svg-engine/environment/environment.provider";

// SVG 생성 및 렌더링
const svgOperation = kami
  .createElement("svg", { width: "200", height: "200", viewBox: "0 0 200 200" })
  .appendChild(
    kami
      .createElement("rect", { x: "10", y: "10", width: "180", height: "180" })
      .setAttributes({ fill: "lightblue", stroke: "blue", "stroke-width": "4" })
  )
  .appendChild(
    kami
      .createElement("circle", { cx: "100", cy: "100", r: "80" })
      .setAttributes({ fill: "yellow", stroke: "orange", "stroke-width": "4" })
  )
  .appendChild(
    kami
      .createElement("text", { x: "100", y: "100", "text-anchor": "middle", "dominant-baseline": "middle" })
      .setAttributes({ fill: "black", "font-size": "24" })
      .appendChild(kami.importSVG("SVG 예시"))
  )
  .render();

svgOperation.runPromise().then(console.log);

const importedSVG = kami.importSVG("<svg><rect /></svg>").render();

importedSVG.runPromise().then(console.log);