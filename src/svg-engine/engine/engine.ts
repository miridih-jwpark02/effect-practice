import { Effect as _, Ref, Context, pipe } from "effect"
import { EF_SVGElement, EF_SVGElementType, EF_SVGAttributes } from "../core/types"
import { Environment } from "../environment/environment"
import type { Effect } from "effect/Effect"

// SVG Engine 서비스
export class SVGEngine extends Context.Tag("SVGEngine")<
SVGEngine, {
  importSVG: (svgString: string) =>
    Effect<EF_SVGElement, Error, Environment>
  render: (element: EF_SVGElement) =>
    Effect<string, Error, Environment>
  createElement: (type: EF_SVGElementType, attributes: EF_SVGAttributes) =>
    Effect<EF_SVGElement>

  // 
  getType: (element: EF_SVGElement) => Effect<EF_SVGElementType>
  getAttributes: (element: EF_SVGElement) => Effect<EF_SVGAttributes>
  getChildren: (element: EF_SVGElement) => Effect<EF_SVGElement[]>
  setAttributes: (element: EF_SVGElement, attributes: EF_SVGAttributes) =>
    Effect<EF_SVGElement>
  appendChild: (element: EF_SVGElement, child: EF_SVGElement) =>
    Effect<EF_SVGElement>
  applyTransform: (element: EF_SVGElement, transform: string) =>
    Effect<EF_SVGElement>
  setStyle: (element: EF_SVGElement, style: string) =>
    Effect<EF_SVGElement>
}> () {}
