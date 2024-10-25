import { Effect, Ref } from "effect";
import { PaperEngine } from "../../svg-engine/paper-engine";
import type { Paper } from "../../paper/type";
import { SVGProcessorContext } from "../../svg-engine/svgProcessor.context";

export const exportPaperItemToSVGElement = (item: Paper.Item) =>
  Effect.gen(function* () {
    // 의존성 로드
    const { paper } = yield* PaperEngine;

    const contextRef = yield* SVGProcessorContext;
    const context = yield* Ref.get(contextRef);

    // 작업 수행
    const currentLayer = paper.project.activeLayer;
    currentLayer.addChild(item);

    const exportedSVG = paper.project.exportSVG({
      bounds: new paper.Rectangle(
        new paper.Point(0, 0),
        new paper.Size(context.displaySize.width, context.displaySize.height)
      ),
      asString: false,
    }) as SVGElement;

    // 프로젝트 제거
    paper.projects.forEach((project) => {
      project.remove();
    });

    // 반환
    return exportedSVG;
  });
