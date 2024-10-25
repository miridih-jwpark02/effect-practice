import { Effect, Ref } from "effect";

import { PaperEngine } from "../svg-engine/paper-engine";
import type { Paper } from "../paper/type";

export const mergeToSinglePath = (item: Paper.Item) =>
  Effect.gen(function* () {
    // 의존성 로드
    const { paper } = yield* PaperEngine;

    // item 내부의 모든 패스를 하나의 패스로 병합
    const targetPaths = item.getItems({
      class: paper.Path,
    }) as Paper.Path[];

    const newPath = targetPaths.reduce((acc, path) => {
      return acc.unite(path) as Paper.Path;
    }, targetPaths[0]);

    // 임의의 색상으로 설정
    newPath.style = {
      fillColor: new paper.Color("#000000"),
    } as Paper.Style;

    // 기존 자식 제거
    item.removeChildren();

    // 새로운 자식 추가
    item.addChildren([newPath]);

    // project clear
    paper.project.clear();

    // 반환
    return item;
  });
