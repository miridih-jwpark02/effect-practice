import { Context, Ref } from "effect";

export type SVGProcessorContextData = {
  svgString: string;
  roundness: number;
  /**
   * SVG 파일 내 리소스 크기
   */
  resourceSize: {
    width: number;
    height: number;
  };
  /**
   * 화면에 표시될 크기
   */
  displaySize: {
    width: number;
    height: number;
  };
};

export class SVGProcessorContext extends Context.Tag("SVGProcessorContext")<
  SVGProcessorContext,
  Ref.Ref<SVGProcessorContextData>
>() {}
