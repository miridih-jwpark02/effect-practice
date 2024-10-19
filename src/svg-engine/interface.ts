import { EF_SVGElement, EF_SVGElementType, EF_SVGAttributes } from "./core/types"

export namespace SVGEngine {
  export interface Service {
    createElement: (type: EF_SVGElementType, attributes: EF_SVGAttributes) => EF_SVGElement
    setAttributes: (element: EF_SVGElement, attributes: EF_SVGAttributes) => EF_SVGElement
    appendChild: (parent: EF_SVGElement, child: EF_SVGElement) => EF_SVGElement
    createGroup: () => EF_SVGElement
    createPath: (data: string) => EF_SVGElement
    applyTransform: (element: EF_SVGElement, transform: string) => EF_SVGElement
    setStyle: (element: EF_SVGElement, style: string) => EF_SVGElement
    addEventListener: (element: EF_SVGElement, event: string, handler: () => void) => void
    render: (element: EF_SVGElement) => string
    importSVG: (svgString: string) => Promise<EF_SVGElement>
  }
}