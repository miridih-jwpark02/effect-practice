# 기하학 문제: 원호의 교점 좌표 찾기

## 문제 설명

두 직선 $PN$과 $PM$이 점 $P$에서 만나고 있습니다. 다음 조건이 주어졌을 때, 점 $Q$의 좌표를 구하세요:

- 선분 $PM$과 선분 $PN$의 길이는 모두 $d$로 같습니다.
- 각 $NPM$을 이등분하는 직선을 $PO$라고 합니다.
- 직선 $PO$ 상의 점 $O$는 직선 $PN$과 직선 $PM$에 각각 점 $N$과 점 $M$에서 접합니다.
- 점 $O$를 중심으로 하고 반지름이 $r = |NO| = |MO|$인 원이 직선 $PO$와 두 점에서 만납니다.
- 이 두 교점 중 점 $P$에 가까운 점을 $Q$라고 합니다.

## 주어진 조건

- 점 $P$의 좌표: $(x, y)$
- $\theta$: 각 $NPM$의 크기

## 구해야 할 것

점 $Q$의 좌표를 $x$, $y$, $d$, $\theta$에 대한 식으로 나타내세요.

## 풀이

이 문제를 해결하기 위해 해석기하학과 삼각함수를 사용하여 $x$, $y$, $d$, $\theta$에 대한 점 $Q$의 좌표를 구하겠습니다.

**1단계: 좌표계 설정**

- 점 $P$를 $(x, y)$에 위치시킵니다.
- 각의 이등분선 $PO$가 $x$축을 따라 놓이도록 합니다.
- 직선 $PN$과 $PM$은 $x$축과 각각 $\theta/2$와 $-\theta/2$ 각도를 이룹니다.

**2단계: 점 $N$과 $M$ 결정**

- $|PN| = |PM| = d$이므로:
  $$
  N = P + d \begin{pmatrix} \cos(\theta/2) \\ \sin(\theta/2) \end{pmatrix}
  $$
  $$
  M = P + d \begin{pmatrix} \cos(\theta/2) \\ -\sin(\theta/2) \end{pmatrix}
  $$

**3단계: $PO$ 상의 점 $O$ 찾기**

- $O$는 $x$축 상에 있으므로 좌표는 $(x_0, y)$입니다.
- $O$를 중심으로 하는 원은 $N$과 $M$을 지나며, $PN$과 $PM$에 이 점들에서 접합니다.

**4단계: $x_0$와 $r$ 계산**

- 반지름이 접점에서 접선에 수직이라는 성질을 이용합니다:
  $$
  \cos(\theta/2)(x_0 - x - d \cos(\theta/2)) - \sin^2(\theta/2)d = 0
  $$
- $x_0$에 대해 풀면:
  $$
  x_0 = x + \frac{d}{\cos(\theta/2)}
  $$
- 반지름 $r$은:
  $$
  r = \frac{d \sin(\theta/2)}{\cos(\theta/2)} = d \tan\left(\frac{\theta}{2}\right)
  $$

**5단계: 점 $Q$ 찾기**

- 원은 $x$축과 다음 지점에서 교차합니다:
  $$
  x = x_0 \pm r
  $$
- $P$에 더 가까운 점(즉, $Q$)은:
  $$
  x_Q = x_0 - r = x + \frac{d}{\cos(\theta/2)} - d \tan\left(\frac{\theta}{2}\right)
  $$
- 간단히 하면:
  $$
  x_Q = x + d \left( \frac{1 - \sin(\theta/2)}{\cos(\theta/2)} \right)
  $$
- $y$좌표는 변하지 않습니다:
  $$
  y_Q = y
  $$

**최종 답:**

점 $Q$의 $x$좌표는 다음과 같습니다:
$$
\boxed{\
x_Q = x + \dfrac{\left(1 - \sin\left(\dfrac{\theta}{2}\right)\right)}{\cos\left(\dfrac{\theta}{2}\right)}d}
$$
$y$좌표는 동일. $y_Q = y$ ($\because$ 시작할 때 각의 이등분선이 $x$축을 따라 놓였기 때문)
