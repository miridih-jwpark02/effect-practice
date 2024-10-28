import { Context, Ref } from "effect";
import { Paper } from "../paper/type";

export type SVGProcessorContextData = {
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
  style?: {
    fillColor?: string;
    fillOpacity?: number;
    strokeColor?: string;
    strokeWidth?: number;
    strokeOpacity?: number;
    strokeAlign?: "center" | "inner" | "outer";
    strokeCap?: string;
    strokeJoin?: string;
    strokeMiterLimit?: number;
    dashArray?: number[];
    dashOffset?: number;
  };
  /**
   * PaperItem instance
   */
  paperItem?: Paper.Item;
  debug: boolean;
};

export class SVGProcessorContext extends Context.Tag("SVGProcessorContext")<
  SVGProcessorContext,
  Ref.Ref<SVGProcessorContextData>
>() {}
