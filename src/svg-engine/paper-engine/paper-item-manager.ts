import { Paper } from "../../paper/type";
import { MD5 } from "crypto-js";

/**
 * PaperItem을 관리하는 클래스
 */
export class PaperItemManager {
  private itemCache: Map<string, Paper.Item>;
  private paper: Paper.PaperScope;

  constructor(paper: Paper.PaperScope) {
    this.itemCache = new Map();
    this.paper = paper;
  }

  /**
   * SVG string의 hash 값을 계산
   * @param {string} svgString - hash 값을 계산할 SVG string
   * @returns {string} 계산된 hash 값
   */
  private calculateHash(svgString: string): string {
    return MD5(svgString).toString();
  }

  /**
   * SVG string에 해당하는 PaperItem을 가져오거나 생성
   * @param {string} svgString - 처리할 SVG string
   * @param {boolean} useCache - cache 사용 여부
   * @returns {Paper.Item} 해당 SVG에 대한 PaperItem
   */
  public getOrCreateItem(svgString: string, useCache: boolean): Paper.Item {
    if (useCache) {
      const hash = this.calculateHash(svgString);

      if (this.itemCache.has(hash)) {
        console.log("cache hit:", hash);
        return this.itemCache.get(hash)!;
      }

      console.log("cache miss:", hash);

      this.paper.setup([0.1, 0.1]); // temporary setup

      const pureSVGString = extractPureSVGString(svgString);

      console.log("pureSVGString", pureSVGString);

      if (pureSVGString instanceof Error) {
        throw pureSVGString;
      }

      const item = this.paper.project.importSVG(pureSVGString);

      console.log("item", item);
      console.log("item.bounds", item.bounds);

      this.itemCache.set(hash, item);

      this.paper.project.remove();

      return item;
    } else {
      this.paper.setup([0.1, 0.1]); // temporary setup
      const pureSVGString = extractPureSVGString(svgString);

      if (pureSVGString instanceof Error) {
        throw pureSVGString;
      }
      const item = this.paper.project.importSVG(svgString);
      this.paper.project.remove();

      console.log("no cache:");

      return item;
    }
  }

  /**
   * Cache를 clear
   */
  public clearCache(): void {
    this.itemCache.clear();
  }
}

/**
 * SVG string에서 <svg> 태그와 그 내용을 추출
 * @param rawString - SVG string이 포함된 문자열
 * @returns SVG 태그와 그 내용을 포함한 문자열
 */
const extractPureSVGString = (rawString: string): string | Error => {
  const svgRegex = /<svg[\s\S]*?<\/svg>/i;
  const match = rawString.match(svgRegex);
  return match ? match[0] : new Error("No SVG found");
};
