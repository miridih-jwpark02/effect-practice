import { Effect, Ref, Context, pipe } from "effect";
import {
  EF_SVGElement,
  EF_SVGElementType,
  EF_SVGAttributes,
} from "../core/types";
import { Environment } from "../environment/environment";

// SVG Engine 서비스
export class SVGEngine extends Context.Tag("SVGEngine")<
  SVGEngine,
  {
    importSVG: (
      svgString: string
    ) => Effect.Effect<EF_SVGElement, Error, Environment>;
    render: (
      element: EF_SVGElement
    ) => Effect.Effect<string, Error, Environment>;
    createElement: (
      type: EF_SVGElementType,
      attributes: EF_SVGAttributes
    ) => Effect.Effect<EF_SVGElement>;

    //
    getType: (element: EF_SVGElement) => Effect.Effect<EF_SVGElementType>;
    getAttributes: (element: EF_SVGElement) => Effect.Effect<EF_SVGAttributes>;
    getChildren: (element: EF_SVGElement) => Effect.Effect<EF_SVGElement[]>;
    setAttributes: (
      element: EF_SVGElement,
      attributes: EF_SVGAttributes
    ) => Effect.Effect<EF_SVGElement>;
    appendChild: (
      element: EF_SVGElement,
      child: EF_SVGElement
    ) => Effect.Effect<EF_SVGElement>;
    applyTransform: (
      element: EF_SVGElement,
      transform: string
    ) => Effect.Effect<EF_SVGElement>;
    setStyle: (
      element: EF_SVGElement,
      style: string
    ) => Effect.Effect<EF_SVGElement>;

    // selector
    select: (
      element: EF_SVGElement,
      selector: string
    ) => Effect.Effect<EF_SVGElement[], Error, Environment>;
  }
>() {}

export type SVGEngineShape = Context.Tag.Service<SVGEngine>;
