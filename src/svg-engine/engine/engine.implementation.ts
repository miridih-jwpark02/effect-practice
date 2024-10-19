import { Context, Effect, pipe } from "effect"
import { Environment } from "../environment/environment"
import { SVGEngine } from "./engine"
import { renderToString, xmlToEF_SVGElement } from "../core/utils"

// SVG Engine 구현
export const SVGEngineImplementation: Context.Tag.Service<SVGEngine> = {
  createElement: (type, attributes) =>
    Effect.succeed({ type, attributes, children: [] }),

  setAttributes: (newAttributes) => (element) =>
    Effect.succeed({ ...element, attributes: { ...element.attributes, ...newAttributes } }),

  appendChild: (child) => (parent) =>
    Effect.succeed({ ...parent, children: [...parent.children, child] }),

  createGroup: () =>
    Effect.succeed({ type: "g", attributes: {}, children: [] }),

  createPath: (data) =>
    Effect.succeed({ type: "path", attributes: { d: data }, children: [] }),

  applyTransform: (transform) => (element) =>
    Effect.succeed({ ...element, attributes: { ...element.attributes, transform } }),

  setStyle: (style) => (element) =>
    Effect.succeed({ ...element, attributes: { ...element.attributes, style } }),

  addEventListener: (event, handler) => (element) =>
    Effect.succeed(undefined),

  render: (element) =>
    Effect.succeed(renderToString(element)),

  importSVG: (svgString) =>
    pipe(
      Environment,
      Effect.flatMap((env) => env.domParser),
      Effect.map((domParser) => domParser.parseFromString(svgString, "text/xml")),
      Effect.map((xmlDoc) => xmlToEF_SVGElement(xmlDoc.documentElement)),
      Effect.catchAll(() => Effect.fail(new Error('Failed to convert XML to SVGElement')))
    )
}