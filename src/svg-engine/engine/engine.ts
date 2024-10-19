import { Effect, Context } from "effect"
import { EF_SVGElement, EF_SVGElementType, EF_SVGAttributes } from "../core/types"
import { Environment } from "../environment/environment"

// SVG Engine 서비스
export class SVGEngine extends Context.Tag("SVGEngine")<
SVGEngine, {
  createElement: (type: EF_SVGElementType, attributes: EF_SVGAttributes) => 
    Effect.Effect<EF_SVGElement, never, never>
  setAttributes: (attributes: EF_SVGAttributes) =>
    (element: EF_SVGElement) => 
      Effect.Effect<EF_SVGElement, never, never>
  appendChild: (child: EF_SVGElement) =>
    (parent: EF_SVGElement) =>
      Effect.Effect<EF_SVGElement, never, never>
  createGroup: () =>
    Effect.Effect<EF_SVGElement, never, never>
  createPath: (data: string) =>
    Effect.Effect<EF_SVGElement, never, never>
  applyTransform: (transform: string) =>
    (element: EF_SVGElement) =>
      Effect.Effect<EF_SVGElement, never, never>
  setStyle: (style: string) =>
    (element: EF_SVGElement) =>
      Effect.Effect<EF_SVGElement, never, never>
  addEventListener: (event: string, handler: () => void) =>
    (element: EF_SVGElement) =>
      Effect.Effect<void, never, never>
  render: (element: EF_SVGElement) =>
    Effect.Effect<string, never, never>
  importSVG: (svgString: string) =>
    Effect.Effect<EF_SVGElement, Error, Environment>
}>  () {}