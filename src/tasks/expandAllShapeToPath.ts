import { Effect } from 'effect';
import type { Paper } from '../paper/type';
import { PaperEngine } from '../svg-engine/paper-engine';

export const expandAllShapeToPath = (item: Paper.Item) =>
  Effect.gen(function* () {
    // 의존성 로드
    const { paper } = yield* PaperEngine;

    const newChildren: Paper.Item[] = [];

    const convertToPath = (child: Paper.Item) => {
      if (child instanceof paper.Shape) {
        return child.toPath(false);
      }
      if (child instanceof paper.Group) {
        child.children.forEach((child) => {
          newChildren.push(convertToPath(child));
        });
      }
      return child;
    };

    item.children.forEach((child) => {
      newChildren.push(convertToPath(child));
    });

    // 비어있는 패스는 제외
    const filteredConvertedPaths = newChildren.filter((shape) => shape.fillColor !== null);

    item.removeChildren();

    // 변환된 패스 추가
    item.addChildren(filteredConvertedPaths);

    // project clear
    paper.project.clear();

    // 반환
    return item;
  });
