/* eslint-disable no-restricted-syntax */
import * as paper from "paper/dist/paper-core";

namespace Paper {
  export class PaperScope extends paper.PaperScope {}
  export class Color extends paper.Color {}
  export class Item extends paper.Item {}
  export class Path extends paper.Path {}
  export class Shape extends paper.Shape {}
  export class Group extends paper.Group {}
  export class CompoundPath extends paper.CompoundPath {}
  export class Size extends paper.Size {}
  export class Point extends paper.Point {}
  export class Segment extends paper.Segment {}
  export class PointText extends paper.PointText {}
  export class Layer extends paper.Layer {}
}

export type { Paper };
