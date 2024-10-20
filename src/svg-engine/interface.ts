import { EF_SVGElement, EF_SVGElementType, EF_SVGAttributes } from "./core/types"
import { Effect } from "effect"

// SVGEngine 인터페이스 정의
export abstract class SVGEngine {
  // 
  static importSVG: (svgString: string) => SVGElement
  static render: (element: SVGElement) => string
  static createElement: (type: EF_SVGElementType, attributes: EF_SVGAttributes) => SVGElement
  /**
   * 아래 메서드들은 SVGElement 인스턴스에 대해 작동합니다.
   */
  static setAttributes: (element: SVGElement, attributes: EF_SVGAttributes) => SVGElement
  static appendChild: (parent: SVGElement, child: SVGElement) => SVGElement
  static applyTransform: (element: SVGElement, transform: string) => SVGElement
  static setStyle: (element: SVGElement, style: string) => SVGElement
}

// SVGElement 인터페이스 정의
export interface SVGElement {
  /**
   * SVGElement 인스턴스에 대한 속성들입니다.
   */
  type: EF_SVGElementType
  attributes: EF_SVGAttributes
  children: SVGElement[]
  /**
   * 아래 메서드들은 체이닝 가능한 메서드들입니다.
   */
  setAttributes: (attributes: EF_SVGAttributes) => SVGElement
  appendChild: (child: SVGElement) => SVGElement
  applyTransform: (transform: string) => SVGElement
  setStyle: (style: string) => SVGElement
}
