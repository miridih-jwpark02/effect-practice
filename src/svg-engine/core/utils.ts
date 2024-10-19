import { EF_SVGElement, EF_SVGElementType } from "./types"

// XML 노드를 EF_SVGElement로 변환하는 순수 함수
export const xmlToEF_SVGElement = (node: Element): EF_SVGElement => ({
  type: node.tagName as EF_SVGElementType,
  attributes: Array.from(node.attributes).reduce((acc, attr) => ({ ...acc, [attr.name]: attr.value }), {}),
  children: Array.from(node.childNodes)
    .filter((childNode): childNode is Element => childNode.nodeType === 1)
    .map(xmlToEF_SVGElement)
})

// SVG를 문자열로 렌더링하는 순수 함수
export const renderToString = (element: EF_SVGElement): string => {
  const attributes = Object.entries(element.attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ")

  const childrenString = element.children.map(renderToString).join("")

  return element.children.length > 0
    ? `<${element.type} ${attributes}>${childrenString}</${element.type}>`
    : `<${element.type} ${attributes} />`
}