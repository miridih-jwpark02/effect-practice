import { Context, pipe } from "effect"
import * as _ from "effect/Effect"
import { Environment } from "../environment/environment"
import { SVGEngine } from "./engine"
import { renderToString, xmlToEF_SVGElement } from "../core/utils"

// SVG Engine 구현
export const SVGEngineImplementation: Context.Tag.Service<SVGEngine> = {
  createElement: (type, attributes) =>
    _.succeed({ type, attributes, children: [] }),

  setAttributes: (newAttributes) => (element) =>
    _.succeed({ ...element, attributes: { ...element.attributes, ...newAttributes } }),

  appendChild: (child) => (parent) =>
    _.succeed({ ...parent, children: [...parent.children, child] }),

  createGroup: () =>
    _.succeed({ type: "g", attributes: {}, children: [] }),

  createPath: (data) =>
    _.succeed({ type: "path", attributes: { d: data }, children: [] }),

  applyTransform: (transform) => (element) =>
    _.succeed({ ...element, attributes: { ...element.attributes, transform } }),

  setStyle: (style) => (element) =>
    _.succeed({ ...element, attributes: { ...element.attributes, style } }),

  addEventListener: (event, handler) => (element) =>
    _.succeed(undefined),

  render: (element) =>
    _.succeed(renderToString(element)),

  importSVG: (svgString) =>
    pipe(
      Environment,
      _.flatMap((env) => env.domParser),
      _.map((domParser) => domParser.parseFromString(svgString, "text/xml")),
      _.map((xmlDoc) => xmlToEF_SVGElement(xmlDoc.documentElement)),
      _.catchAll(() => _.fail(new Error('Failed to convert XML to SVGElement')))
    )
}