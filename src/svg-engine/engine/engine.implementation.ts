import { Context, pipe } from 'effect';
import * as _ from 'effect/Effect';
import { Environment } from '../environment/environment';
import { SVGEngine } from './engine';
import { renderToString, xmlToEF_SVGElement } from '../core/utils';

// SVG Engine 구현
export const SVGEngineImplementation: Context.Tag.Service<SVGEngine> = {
  createElement: (type, attributes) =>
    _.succeed({ type, attributes, children: [] }),

  render: (element) => _.try({
    try: () => renderToString(element),
    catch: () => new Error('Failed to render SVGElement')
  }),

  importSVG: (svgString) =>
    pipe(
      Environment,
      _.flatMap((env) => env.domParser),
      _.map((domParser) => domParser.parseFromString(svgString, 'text/xml')),
      _.map((xmlDoc) => xmlToEF_SVGElement(xmlDoc.documentElement)),
      _.catchAll(() => _.fail(new Error('Failed to convert XML to SVGElement')))
    ),

  getType: (element) => _.succeed(element.type),

  getAttributes: (element) => _.succeed(element.attributes),

  getChildren: (element) => _.succeed(element.children),

  setAttributes: (element, attributes) =>
    _.succeed({
      ...element,
      attributes: { ...element.attributes, ...attributes },
    }),

  appendChild: (element, child) =>
    _.succeed({
      ...element,
      children: [...element.children, child],
    }),

  applyTransform: (element, transform) =>
    _.succeed({
      ...element,
      attributes: {
        ...element.attributes,
        transform: element.attributes.transform
          ? `${element.attributes.transform} ${transform}`
          : transform,
      },
    }),

  setStyle: (element, style) =>
    _.succeed({
      ...element,
      attributes: {
        ...element.attributes,
        style: element.attributes.style
          ? `${element.attributes.style} ${style}`
          : style,
      },
    }),
};
