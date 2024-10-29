import { Context, Ref } from "effect";
import { Paper } from "../paper/type";

type SVGStyle = {
  fillColor?: string;
  fillOpacity?: number;
  strokeColor?: string;
  strokeWidth?: number;
  strokeAlign?: "center" | "inner" | "outer";
  strokeOpacity?: number;
  strokeCap?: string;
  strokeJoin?: string;
  strokeMiterLimit?: number;
  dashArray?: number[];
  dashOffset?: number;
};

type LayerStrain = {
  /**
   * 크기 변형률
   */
  scale: {
    x: number;
    y: number;
  };
  /**
   * 위치 변형률
   */
  position: {
    x: number;
    y: number;
  };
};

export type LayerItem = {
  /**
   * 레이어 id
   */
  id: string;
  /**
   * 레이어 bound
   */
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  /**
   * 레이어 변형률
   */
  strain: LayerStrain;
};

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
  /**
   * scale
   */
  scale: number | { x: number; y: number }; // 1 is 100%
  style?: SVGStyle;
  /**
   * PaperItem instance
   */
  paperItem?: Paper.Item;
  layerData?: LayerItem[];
  debug: boolean;
};

export class SVGProcessorContext extends Context.Tag("SVGProcessorContext")<
  SVGProcessorContext,
  Ref.Ref<SVGProcessorContextData>
>() {}
