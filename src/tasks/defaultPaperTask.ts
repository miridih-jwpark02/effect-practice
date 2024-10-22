import { Effect } from "effect";
import { ProcessTask } from "./types";
import { PaperEngine } from "../svg-engine/paper-engine";
import type { Paper } from "../paper";
import { provideDependencies } from "../provideDependencies";

const _defaultPaperTask: (params: any) => ProcessTask<Paper.Item, Paper.Item> =
  (params: any) => (item: Paper.Item) =>
    Effect.gen(function* () {
      // 의존성 로드
      const paperEngine = yield* PaperEngine;

      // 환경 설정
      const paper = yield* paperEngine.setup(100, 100);

      // 작업 수행

      // do something here

      // 프로젝트 제거
      paper.project.remove();

      // 반환
      return item;
    });

export const defaultPaperTask = (params: any) =>
  provideDependencies(_defaultPaperTask(params));
