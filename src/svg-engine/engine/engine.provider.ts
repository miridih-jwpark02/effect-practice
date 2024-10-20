import { Layer } from "effect"
import { SVGEngineImplementation } from "./engine.implementation"
import { SVGEngine } from "./engine"

// SVG Engine 레이어
export const SVGEngineProvider = Layer.succeed(
  SVGEngine,
  SVGEngineImplementation
)