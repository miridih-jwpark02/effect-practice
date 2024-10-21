import { Context, Effect, pipe } from "effect";
import { Environment } from "../environment/environment";
import { SVGEngine } from "./engine";
import {
  efSVGElementToXML,
  renderToString,
  xmlToEF_SVGElement,
} from "../core/utils";

// SVG Engine 구현
export const SVGEngineImplementation: Context.Tag.Service<SVGEngine> = {
  createElement: (type, attributes) =>
    Effect.succeed({ type, attributes, children: [] }),

  render: (element) =>
    Effect.try({
      try: () => renderToString(element),
      catch: () => new Error("Failed to render SVGElement"),
    }),

  importSVG: (svgString) =>
    pipe(
      Environment,
      Effect.flatMap((env) => env.domParser),
      Effect.map((domParser) =>
        domParser.parseFromString(svgString, "text/xml")
      ),
      Effect.map((xmlDoc) => xmlToEF_SVGElement(xmlDoc.documentElement)),
      Effect.catchAll(() =>
        Effect.fail(new Error("Failed to convert XML to SVGElement"))
      )
    ),

  getType: (element) => Effect.succeed(element.type),

  getAttributes: (element) => Effect.succeed(element.attributes),

  getChildren: (element) => Effect.succeed(element.children),

  setAttributes: (element, attributes) =>
    Effect.succeed({
      ...element,
      attributes: { ...element.attributes, ...attributes },
    }),

  appendChild: (element, child) =>
    Effect.succeed({
      ...element,
      children: [...element.children, child],
    }),

  applyTransform: (element, transform) =>
    Effect.succeed({
      ...element,
      attributes: {
        ...element.attributes,
        transform: element.attributes.transform
          ? `${element.attributes.transform} ${transform}`
          : transform,
      },
    }),

  setStyle: (element, style) =>
    Effect.succeed({
      ...element,
      attributes: {
        ...element.attributes,
        style: element.attributes.style
          ? `${element.attributes.style} ${style}`
          : style,
      },
    }),

  select: (element, selector) =>
    pipe(
      Environment,
      Effect.flatMap((env) => env.document),
      Effect.map((document) => efSVGElementToXML(element, document)),
      Effect.map((element) => element.querySelectorAll(selector)),
      Effect.map((nodes) =>
        Array.from(nodes).map((node) => xmlToEF_SVGElement(node as Element))
      )
    ),
};
