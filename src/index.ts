import { Effect } from "effect";

import { runnable } from "./program";

Effect.runPromise(runnable);

// usage

// const commands = [
//   scale(2),
//   rotate(90),
//   translate(100, 100),
//   merge(),
// ]

// const importSVG = (svgString: string) => {
//   return parseSVG(svgString)
// }

// const applyCommand = (command: Command) => (element: EF_SVGElement) => {
//   return command(element)
// }

// const filterElements = (selector: string) => (element: EF_SVGElement) => {
//   return element.querySelectorAll(selector)
// }

// const createSVG = (type: EF_SVGElementType, attributes: EF_SVGAttributes) => {
//   return createElement(type, attributes)
// }

// const group = (elements: EF_SVGElement[]) => {
//   return elements.reduce((acc, element) => merge(acc, element), elements[0])
// }

// const merge = (elements: EF_SVGElement[]) => {
//   return elements.reduce((acc, element) => merge(acc, element), elements[0])
// }

// const style = (style: EF_SVGStyle) => (element: EF_SVGElement) => {
//   return setStyle(style)(element)
// }

// const translate = (x: number, y: number) => (element: EF_SVGElement) => {
//   return translate(x, y)(element)
// }

// {
//   const svg = importSVG(svgString)
//   const rects = svg.filterElements('rect')
//   const scaledRects = rects.map((rect) => rect.scale(2))
//   const rotatedRects = scaledRects.map((rect) => rect.rotate(90))
//   const translatedRects = rotatedRects.map((rect) => rect.translate(100, 100))
//   const grouped = translatedRects.reduce((acc, element) => acc.appendChild(element), createElement('group', {}))
//   const styledGroup = grouped.style({ stroke: 'black', fill: 'none' })
//   const result = createSVG('svg', {
//     children: [styledGroup],
//   })
// }
// // or
// {
//   const svg = importSVG(svgString)
//   const rects = filterElements(svg, 'rect')
//   const scaledRects = rects.map((rect) => scale(rect, 2))
//   const rotatedRects = scaledRects.map((rect) => rotate(rect, 90))
//   const translatedRects = rotatedRects.map((rect) => translate(rect, 100, 100))
//   const grouped = translatedRects.reduce((acc, element) => appendChild(acc, element), createElement('group', {}))
//   const styledGroup = style(grouped, { stroke: 'black', fill: 'none' })
//   const result = createSVG('svg', {
//     children: [styledGroup],
//   })
// }

// // or

// const result2 = svg
//   .filterElements('rect')
//   .map((rect) => rect.scale(2))
//   .map((rect) => rect.rotate(90))
//   .map((rect) => rect.translate(100, 100))
//   .reduce((acc, element) => merge(acc, element), svg.children[0])
//   .style({ stroke: 'black', fill: 'none' })

// import { createSVGEngine } from "./svg-engine/wrapper"

// const svgEngine = createSVGEngine()

// const svg = svgEngine.importSVG('<svg><rect x="10" y="10" width="100" height="50"/></svg>')
// const rects = svg.children.filter(child => child.type === "rect")
// const scaledRects = rects.map(rect => rect.setAttributes({ width: Number(rect.attributes.width) * 2, height: Number(rect.attributes.height) * 2 }))
// const rotatedRects = scaledRects.map(rect => rect.applyTransform("rotate(90)"))
// const translatedRects = rotatedRects.map(rect => rect.applyTransform("translate(100, 100)"))
// const group = svgEngine.createGroup()
// translatedRects.forEach(rect => group.appendChild(rect))
// const styledGroup = group.setStyle("stroke: black; fill: none;")
// const result = svgEngine.createElement("svg", {})
// result.appendChild(styledGroup)

// console.log(svgEngine.render(result))
