import { Effect } from "effect";
import { ProcessTask } from "./types";
import { PaperEngine } from "../svg-engine/paper-engine";
import type { Paper } from "../paper";

type MergeToSinglePathParams = {
  item: Paper.Item;
  size?: {
    width: number;
    height: number;
  };
};

type MergeToSinglePathResult = {
  item: Paper.Item;
};

export const mergeToSinglePath: ProcessTask<
  MergeToSinglePathParams,
  MergeToSinglePathResult
> = (params: MergeToSinglePathParams) =>
  Effect.gen(function* () {
    // 의존성 로드
    const paperEngine = yield* PaperEngine;

    // 환경 설정
    const paper = yield* paperEngine.setup(
      params.size?.width ?? 1000,
      params.size?.height ?? 1000
    );

    // 작업 수행

    // item 내부의 모든 패스를 하나의 패스로 병합
    const targetPaths = params.item.getItems({
      class: paper.Path,
    }) as Paper.Path[];

    const newPath = targetPaths.reduce((acc, path) => {
      return new paper.Path(acc.unite(path).pathData);
    }, targetPaths[0]);

    newPath.style.fillColor = new paper.Color("#000000");

    params.item.removeChildren();

    params.item.addChildren([newPath]);
    // 프로젝트 제거
    paper.project.remove();

    // 반환
    return {
      item: params.item,
    };
  });
