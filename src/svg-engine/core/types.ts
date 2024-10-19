// SVG 요소 타입
export type EF_SVGElementType = "rect" | "circle" | "path" | "text" | "g"

// SVG 요소 속성
export type EF_SVGAttributes = Record<string, string | number>

// SVG 요소
export type EF_SVGElement = {
  type: EF_SVGElementType
  attributes: EF_SVGAttributes
  children: EF_SVGElement[]
}

// DOM 파서
export type EF_DOMParser = {
  parseFromString: (str: string, type: string) => Document
}