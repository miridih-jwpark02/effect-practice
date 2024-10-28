import { Effect, Ref } from "effect";
import { PaperEngine } from "../svg-engine/paper-engine";
import type { Paper } from "../paper/type";
import { SVGProcessorContext } from "../svg-engine/svgProcessor.context";

export const applyStyleToAllPath = (item: Paper.Item) =>
  Effect.gen(function* () {
    // 의존성 로드
    const { paper } = yield* PaperEngine;

    // 컨텍스트 로드
    const contextRef = yield* SVGProcessorContext;
    const context = yield* Ref.get(contextRef);

    // item 내부의 모든 Shape를 Path로 변환
    const targetPaths = item.getItems({
      recursive: true,
      class: paper.Path,
    }) as Paper.Path[];

    // 비어있는 패스는 제외
    const filteredTargetPaths = targetPaths.filter(
      (path) => path.fillColor !== null
    );

    filteredTargetPaths.forEach((path) => {
      const prevStyle = path.style;

      console.log("prevStyle", prevStyle);
      console.log("context.style", context.style);

      // strokeAlign 적용
      // @todo 임시로 inner로 고정 - 추후에는 스타일 적용 시 스타일 자체에 strokeAlign 포함
      context.style = {
        ...context.style,
        strokeWidth: context.style?.strokeWidth
          ? context.style.strokeWidth * 2
          : prevStyle.strokeWidth,
        strokeAlign: "inner",
      };

      path.style = {
        ...prevStyle,
        fillColor: context.style?.fillColor
          ? new paper.Color(context.style?.fillColor)
          : prevStyle.fillColor instanceof paper.Color
          ? prevStyle.fillColor
          : null,
        strokeColor: context.style?.strokeColor
          ? new paper.Color(context.style?.strokeColor)
          : prevStyle.strokeColor instanceof paper.Color
          ? prevStyle.strokeColor
          : null,
        strokeWidth: context.style?.strokeWidth ?? prevStyle.strokeWidth,
        strokeCap: context.style?.strokeCap ?? prevStyle.strokeCap,
        strokeJoin: context.style?.strokeJoin ?? prevStyle.strokeJoin,
        dashArray: context.style?.dashArray ?? prevStyle.dashArray,
        dashOffset: context.style?.dashOffset ?? prevStyle.dashOffset,
        miterLimit: context.style?.strokeMiterLimit ?? prevStyle.miterLimit,
      };

      switch (context.style?.strokeAlign) {
        case "center":
          // svg 기본 값
          break;
        case "inner":
          {
            // clip path 영역 내부에 맞춤
            // 원본 path 복제
            const clonedPath = path.clone();
            // 복제된 path에 clip path 적용
            clonedPath.clipMask = true;
          }
          break;
        case "outer":
          {
            // clip path 영역 외부에 맞춤
            // @todo 외부에 맞추는 방법 찾아보기
          }
          break;
      }
    });

    // 반환
    return item;
  });
