# SVG Processor

SVG Processor는 SVG 파일을 효율적으로 처리하고 변환하는 강력한 도구입니다. 이 프로젝트는 SVG 조작, 최적화 및 변환을 위한 다양한 기능을 제공합니다.

- [SVG Processor](#svg-processor)
  - [주요 기능](#주요-기능)
  - [Installation](#installation)
  - [Quick Start](#quick-start)
  - [Documentation](#documentation)
  - [Dependencies](#dependencies)
  - [개발 환경 설정](#개발-환경-설정)
  - [Contributing](#contributing)
  - [License](#license)
- [SVG Processor 사용 가이드](#svg-processor-사용-가이드)
  - [1. SvgProcessor 클래스 초기화](#1-svgprocessor-클래스-초기화)
  - [2. SVG 처리 옵션 설정](#2-svg-처리-옵션-설정)
  - [3. 처리 프로그램 선택](#3-처리-프로그램-선택)
  - [4. SVG 처리 실행](#4-svg-처리-실행)
  - [5. 결과 사용](#5-결과-사용)
  - [전체 사용 예시](#전체-사용-예시)
  - [주의사항](#주의사항)
  - [Dependencies](#dependencies-1)
    - [설치](#설치)
    - [개발 환경 설정](#개발-환경-설정-1)


## 주요 기능

- SVG 파일 parsing 및 manipulation
- SVG 요소의 shape 및 style 수정
- SVG 크기 조정 및 최적화
- 다양한 processing program 지원

## Installation

npm을 사용하여 SVG Processor를 설치할 수 있습니다:

```bash
npm install svg-processor
```

또는 yarn을 사용:

```bash
yarn add svg-processor
```

## Quick Start

SVG Processor를 사용하는 기본적인 예제입니다:

```typescript
import { SvgProcessor, testProgram } from 'svg-processor';

const svgProcessor = new SvgProcessor();
const options = {
  svgString: '<svg>...</svg>',
  roundness: 50,
  resourceSize: { width: 100, height: 100 },
  displaySize: { width: 200, height: 200 },
};

const processedSvg = await svgProcessor.run(options, testProgram);
```

## Documentation

자세한 사용법과 API 문서는 [사용 가이드](#svg-processor-사용-가이드) 섹션을 참조하세요.

## Dependencies

SVG Processor는 다음과 같은 주요 dependencies를 사용합니다:

- **React**: UI 구성을 위한 JavaScript library
- **TypeScript**: JavaScript의 정적 typing 지원을 위한 superset
- **RxJS**: reactive programming을 위한 library
- **Paper.js**: vector graphics scripting을 위한 framework
- **Effect**: functional programming을 위한 library

## 개발 환경 설정

1. 이 repository를 clone합니다.
2. Dependencies를 설치합니다:
   ```bash
   npm install
   ```
   또는
   ```bash
   yarn install
   ```
3. 개발 서버를 실행합니다:
   ```bash
   npm start
   ```
   또는
   ```bash
   yarn start
   ```

이제 `http://localhost:3000`에서 application에 접근할 수 있습니다.

## Contributing

프로젝트에 기여하고 싶으시다면 [CONTRIBUTING.md](CONTRIBUTING.md) 파일을 참조해 주세요.

## License

이 프로젝트는 MIT license 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

# SVG Processor 사용 가이드

이 가이드에서는 SVG Processor의 상세한 사용법을 설명합니다.

- [SVG Processor](#svg-processor)
  - [주요 기능](#주요-기능)
  - [Installation](#installation)
  - [Quick Start](#quick-start)
  - [Documentation](#documentation)
  - [Dependencies](#dependencies)
  - [개발 환경 설정](#개발-환경-설정)
  - [Contributing](#contributing)
  - [License](#license)
- [SVG Processor 사용 가이드](#svg-processor-사용-가이드)
  - [1. SvgProcessor 클래스 초기화](#1-svgprocessor-클래스-초기화)
  - [2. SVG 처리 옵션 설정](#2-svg-처리-옵션-설정)
  - [3. 처리 프로그램 선택](#3-처리-프로그램-선택)
  - [4. SVG 처리 실행](#4-svg-처리-실행)
  - [5. 결과 사용](#5-결과-사용)
  - [전체 사용 예시](#전체-사용-예시)
  - [주의사항](#주의사항)
  - [Dependencies](#dependencies-1)
    - [설치](#설치)
    - [개발 환경 설정](#개발-환경-설정-1)

## 1. SvgProcessor 클래스 초기화

먼저 `SvgProcessor` 클래스의 인스턴스를 생성합니다.

```typescript
const svgProcessor = new SvgProcessor();
```

## 2. SVG 처리 옵션 설정

SVG 처리를 위한 옵션을 설정합니다. 옵션은 다음과 같은 구조를 가집니다:

```typescript
const options = {
  svgString: string,
  roundness: number,
  resourceSize: {
    width: number,
    height: number,
  },
  displaySize: {
    width: number,
    height: number,
  },
};
```

- `svgString`: 처리할 SVG 문자열
- `roundness`: 둥근 정도 (0-100)
- `resourceSize`: 원본 SVG의 크기
- `displaySize`: 화면에 표시될 크기

## 3. 처리 프로그램 선택

SVG 처리를 위한 프로그램을 선택합니다. 예를 들어, `testProgram`이나 `shapeProgram`을 사용할 수 있습니다.

```typescript
import { testProgram } from "./programs/test";
// 또는
import { shapeProgram } from "./programs/shape";
```

## 4. SVG 처리 실행

`run` 메소드를 사용하여 SVG 처리를 실행합니다:

```typescript
const svg = await svgProcessor.run(options, testProgram);
```

## 5. 결과 사용

처리된 SVG 요소를 받아 원하는 대로 사용합니다. 예를 들어, DOM에 추가할 수 있습니다:

```typescript
document.body.appendChild(svg);
```

## 전체 사용 예시

다음은 `Renderer` 컴포넌트에서 SVG Processor를 사용하는 전체 예시입니다:

```typescript
const processSVG = async (
  svgString: string,
  scale: number,
  roundness: number,
  displaySize?: {
    width: number;
    height: number;
  }
) => {
  const svgElement = new DOMParser().parseFromString(
    svgString,
    "image/svg+xml"
  );

  const width = svgElement.documentElement.getAttribute("width");
  const height = svgElement.documentElement.getAttribute("height");

  const svgResourceSize = {
    width: Number(width),
    height: Number(height),
  };

  const svgDisplaySize = displaySize ?? {
    width: (svgResourceSize.width * scale) / 100,
    height: (svgResourceSize.height * scale) / 100,
  };

  const svgProcessor = new SvgProcessor();

  const svg = await svgProcessor.run(
    {
      svgString,
      roundness,
      resourceSize: svgResourceSize,
      displaySize: svgDisplaySize,
    },
    testProgram
    // shapeProgram
  );

  return svg;
};
```

이 예시에서는 SVG 문자열, 스케일, 둥근 정도를 입력받아 SVG를 처리하고 결과를 반환합니다.

## 주의사항

- SVG 처리는 비동기로 수행되므로 `await`를 사용하거나 Promise를 처리해야 합니다.
- 성능 측정 결과는 `performanceSubject`를 통해 구독할 수 있습니다.
- 처리된 SVG는 DOM 요소로 반환되므로 직접 DOM에 추가하거나 조작할 수 있습니다.

이 가이드를 따라 SVG Processor를 사용하여 SVG 파일을 효과적으로 처리하고 변환할 수 있습니다.

## Dependencies

SVG Processor는 다음과 같은 주요 dependencies를 사용합니다:

- **React**: UI 구성을 위한 JavaScript 라이브러리
- **TypeScript**: JavaScript의 정적 타입 지원을 위한 superset
- **RxJS**: 반응형 프로그래밍을 위한 라이브러리
- **Paper.js**: vector graphics scripting를 위한 프레임워크

### 설치

프로젝트의 dependencies를 설치하려면 다음 명령어를 실행하세요:

```bash
npm install
```

또는

```bash
yarn install
```

### 개발 환경 설정

1. 이 repository를 clone합니다.
2. dependencies를 설치합니다.
3. 개발 서버를 실행합니다:

```bash
npm start
```

또는

```bash
yarn start
```

이제 `http://localhost:3000`에서 애플리케이션에 접근할 수 있습니다.
