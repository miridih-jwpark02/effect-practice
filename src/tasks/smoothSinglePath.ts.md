# smoothSinglePath 함수 설명

- [smoothSinglePath 함수 설명](#smoothsinglepath-함수-설명)
  - [개요](#개요)
  - [주요 단계](#주요-단계)
  - [주요 개념](#주요-개념)
    - [Mid-Linear 인덱스](#mid-linear-인덱스)
    - [각도 방향 설명](#각도-방향-설명)
      - [각도 계산 예시](#각도-계산-예시)
  - [핵심 알고리즘](#핵심-알고리즘)
    - [1. 각도 계산](#1-각도-계산)
    - [2. Arc 생성](#2-arc-생성)
    - [3. 참조 길이 계산](#3-참조-길이-계산)
  - [주요 함수](#주요-함수)
  - [결과](#결과)
  - [참고사항](#참고사항)



## 개요

`smoothSinglePath` 함수는 주어진 Paper.js Path 객체를 부드럽게 만드는 작업을 수행합니다. 이 함수는 path의 각진 부분을 둥글게 만들어 전체적으로 부드러운 곡선을 생성합니다.

## 주요 단계

1. **초기화 및 검증**
   - Paper.js engine 및 context 로드
   - 단일 path 검증

2. **Path 분석**
   - Mid-linear 인덱스 계산
   - Path를 세그먼트로 분할
   - 최소 길이 계산
   - 각도 계산

3. **Path 변형**
   - 참조 길이 계산
   - Flat curves 생성
   - Arc curves 생성

4. **결과 생성**
   - 새로운 path 조합
   - 스타일 적용

## 주요 개념

### Mid-Linear 인덱스

Mid-linear 인덱스는 path의 각 세그먼트에서 중요한 변곡점을 식별하는 데 사용됩니다. 이는 path를 부드럽게 만드는 과정에서 핵심적인 역할을 합니다.

1. **정의**: Mid-linear 인덱스는 path의 세그먼트 중에서 선형에 가까운 부분의 중간 지점을 나타냅니다.

2. **계산 방법**:
   - Path의 각 세그먼트를 여러 개의 작은 curve로 분할합니다.
   - 각 curve에 대해 선형성(linearity)을 계산합니다.
   - 선형성이 가장 높은(즉, 가장 직선에 가까운) 연속된 curves의 중간 지점을 mid-linear 인덱스로 선정합니다.

3. **선형성 계산**:
   선형성은 다음과 같이 계산될 수 있습니다:
   
   $$ \text{linearity} = \frac{\text{chord length}}{\text{arc length}} $$

   여기서:
   - chord length: curve의 시작점과 끝점 사이의 직선 거리
   - arc length: curve를 따라 측정한 실제 길이

4. **중요성**:
   - Mid-linear 인덱스는 path의 주요 형태를 유지하면서 부드럽게 만들 수 있는 지점을 식별합니다.
   - 이 지점들을 기준으로 arc를 생성하여 전체적인 path의 형태를 유지하면서 각진 부분을 둥글게 만듭니다.

5. **getMidLinearIndexes 함수**:
   이 함수는 주어진 path에서 모든 mid-linear 인덱스를 찾아 반환합니다. 이 인덱스들은 이후 path 변형 과정에서 중요한 참조점으로 사용됩니다.

Mid-linear 인덱스를 사용함으로써, `smoothSinglePath` 함수는 path의 전체적인 형태를 유지하면서도 효과적으로 부드러운 곡선을 생성할 수 있습니다. 이는 특히 복잡한 형태의 path를 처리할 때 원본의 특성을 보존하면서 부드럽게 만드는 데 큰 도움이 됩니다.

### 각도 방향 설명

Paper.js에서 각도는 다음과 같은 규칙을 따릅니다:

1. **각도의 범위**: 0° ~ 360°

2. **각도의 방향**:
   - 양의 각도(+): 시계 반대 방향 (counterclockwise)
   - 음의 각도(-): 시계 방향 (clockwise)

3. **각도의 기준**:
   - 0°: 양의 x축 방향 (3시 방향)
   - 90°: 양의 y축 방향 (12시 방향)
   - 180°: 음의 x축 방향 (9시 방향)
   - 270°: 음의 y축 방향 (6시 방향)

#### 각도 계산 예시

코드에서 사용된 각도 계산 공식:

$$ \text{absBetweenAngle} = (\text{vector2.angle} - \text{vector1.angle} + 360) \mod 180 $$

이 공식은 두 벡터 사이의 각도를 항상 양수로 표현합니다:

- `vector2.angle - vector1.angle`이 음수가 되면 180°를 더해 양수로 만듭니다.
- 결과가 180°를 초과하면 모듈로 연산(`% 180`)으로 0° ~ 180° 범위 내로 조정합니다.
- 즉, 두 벡터 사이의 최소 각도를 나타냅니다.

예를 들어:
- `vector1.angle`이 30°이고 `vector2.angle`이 60°인 경우:
  - absBetweenAngle = (60° - 30°) = 30° (시계 반대 방향)
- `vector1.angle`이 350°이고 `vector2.angle`이 10°인 경우:
  - absBetweenAngle = (10° - 350° + 360°) % 360° = 20° (시계 반대 방향)

이렇게 계산된 각도는 항상 두 벡터 사이의 최소 각도를 나타내며, 시계 반대 방향으로의 회전을 의미합니다.

## 핵심 알고리즘

### 1. 각도 계산

두 벡터 사이의 각도를 계산합니다:
- 각도는 $+x$축 방향을 기준으로 반시계 방향으로 증가하는 0° ~ 360°의 범위를 가집니다.

$$ \text{getAbsBetweenAngle}(\mathbf{v}_1, \mathbf{v}_2) = (\mathbf{v}_2.angle - \mathbf{v}_1.angle + 360) \mod 360 $$

---

### 2. Arc 생성

Arc를 생성할 때 사용되는 주요 수식:

$$ \text{multiplier} = \left|\frac{1}{\cos(\theta/2)} - \tan(\theta/2)\right| \cdot \text{referenceLength} $$

여기서 $\theta$는 absBetweenAngle (라디안)

이 multiplier를 사용하여 arc의 중간점(arcThrough)을 계산합니다:

$$ \text{directionVector} = \frac{\mathbf{v}_2 - \mathbf{v}_1}{||\mathbf{v}_2 - \mathbf{v}_1||} $$

$$ \text{arcThrough} = \text{primaryPoint} + \text{directionVector} \cdot |\text{multiplier}| $$

### 3. 참조 길이 계산

부드러운 곡선의 정도를 결정하는 참조 길이:

$$ \text{referenceLength} = \text{minLength} \cdot \text{roundness} $$

## 주요 함수

1. `getMidLinearIndexes`: Path의 mid-linear 인덱스를 찾습니다.
2. `getSplitCurves`: Curve를 여러 개의 작은 curve로 분할합니다.
3. `getMinLengthFromCurves`: Curves 중 최소 길이를 찾습니다.
4. `getBetweenAngle`: 두 curve 사이의 각도를 계산합니다.
5. `createArc`: 주어진 각도와 참조 길이를 바탕으로 arc를 생성합니다.

## 결과

이 함수는 원본 path를 부드럽게 만든 새로운 Paper.js Path 객체를 반환합니다. 디버그 모드가 활성화된 경우, 추가적인 시각화 요소들도 함께 생성됩니다.

## 참고사항

- `context.roundness` 값(0~100)에 따라 곡선의 부드러운 정도가 결정됩니다.
- 디버그 모드(`DEBUG = true`)에서는 다양한 시각화 요소가 추가되어 알고리즘의 동작을 확인할 수 있습니다.

이 함수는 복잡한 기하학적 계산을 통해 path를 부드럽게 만들며, 특히 각진 부분을 효과적으로 둥글게 처리합니다.

Arc 생성 공식의 유도 과정을 설명해드리겠습니다. 이 공식은 두 선분 사이에 부드러운 원호(arc)를 생성하기 위해 사용됩니다.

1. **기본 개념**

먼저, 두 선분이 만나는 점을 중심으로 하고 두 선분 사이의 각도의 이등분선 상에 있는 점을 지나는 원호를 그리려고 합니다.

2. **각도 이등분선 상의 점 찾기**

각도 $\theta$의 이등분선 상에 있는 점의 좌표를 찾기 위해, 다음과 같은 삼각함수 관계를 사용합니다:

$$ \text{distance} = \frac{\text{referenceLength}}{\cos(\theta/2)} $$

여기서 referenceLength는 원하는 곡률의 정도를 나타내는 값입니다.

3. **접선 길이 계산**

원호의 시작점에서 끝점까지의 직선 거리(chord)와 접선의 길이 차이를 계산합니다:

$$ \text{tangentLength} = \text{referenceLength} \cdot \tan(\theta/2) $$

4. **Multiplier 계산**

원호의 중간점을 찾기 위한 multiplier는 이 두 값의 차이로 계산됩니다:

$$ \text{multiplier} = \left|\frac{\text{referenceLength}}{\cos(\theta/2)} - \text{referenceLength} \cdot \tan(\theta/2)\right| $$

이를 정리하면:

$$ \text{multiplier} = \left|\frac{1}{\cos(\theta/2)} - \tan(\theta/2)\right| \cdot \text{referenceLength} $$

5. **Arc의 중간점 계산**

이 multiplier를 사용하여 arc의 중간점(arcThrough)을 계산합니다:

$$ \text{arcThrough} = \text{primaryPoint} + \text{directionVector} \cdot |\text{multiplier}| $$

여기서:
- primaryPoint는 두 선분이 만나는 점
- directionVector는 각도 이등분선 방향의 단위 벡터

이 공식을 사용하면, 두 선분 사이에 부드럽게 연결되는 원호를 생성할 수 있습니다. referenceLength를 조절함으로써 원호의 곡률을 제어할 수 있습니다.

이 방법은 기하학적 직관과 삼각함수의 관계를 활용하여 복잡한 곡선을 간단하게 근사화하는 효과적인 방법입니다.


