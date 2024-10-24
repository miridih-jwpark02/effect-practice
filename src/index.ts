import { updateCandleChart, updatePieChart } from "./chart";
import { SvgProcessor, performanceSubject } from "./paper-program";

const main = async () => {
  console.log("main start");
  const processor = new SvgProcessor();
  console.log("processor created");

  const updateResult = async ({
    svgString,
    scale,
    roundness,
    resourceSize,
  }: {
    svgString: string;
    scale: number;
    roundness: number;
    resourceSize?: {
      width: number;
      height: number;
    };
  }) => {
    const { svg: result } = await processor.run({
      svgString,
      scale,
      roundness,
      resourceSize,
    });

    const resultElement = document.getElementById("result");
    if (resultElement) {
      resultElement.innerHTML = "";
      resultElement.appendChild(result);
    }
  };

  // 성능 데이터 구독 및 차트 업데이트
  performanceSubject.subscribe((performanceResult) => {
    updateCandleChart(performanceResult);
    updatePieChart(performanceResult);
  });

  const update = (value: number, labelElement: HTMLElement) => {
    labelElement.textContent = value.toString();
  };

  const svgInput = document.getElementById("svg-input") as HTMLTextAreaElement;
  const rangeScale = document.getElementById(
    "range-scale"
  )! as HTMLInputElement;
  const labelScale = document.getElementById("label-scale")! as HTMLElement;
  const rangeRoundness = document.getElementById(
    "range-roundness"
  )! as HTMLInputElement;
  const labelRoundness = document.getElementById(
    "label-roundness"
  )! as HTMLElement;

  const processSVG = () => {
    const svgString = svgInput.value;
    const scale = Number(rangeScale.value) / 100;
    const roundness = Number(rangeRoundness.value);
    const svgElement = document.getElementById(
      "svg-input"
    ) as unknown as SVGElement;
    const resourceSize = {
      width: Number(svgElement.getAttribute("width")),
      height: Number(svgElement.getAttribute("height")),
    };
    updateResult({ svgString, scale, roundness });
  };

  // SVG input, scale, roundness 변경 시 실시간 업데이트
  svgInput.addEventListener("input", processSVG);

  rangeScale?.addEventListener("input", (e: Event) => {
    if (labelScale) {
      update(Number((e.target as HTMLInputElement).value), labelScale);
    }
    processSVG();
  });

  rangeRoundness?.addEventListener("input", (e: Event) => {
    if (labelRoundness) {
      update(Number((e.target as HTMLInputElement).value), labelRoundness);
    }
    processSVG();
  });

  // 초기 SVG 설정
  svgInput.value = `<svg width="1241" height="1076" viewBox="0 0 1241 1076" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="455" y="324" width="520" height="685" fill="#5D2626"/>
<rect y="324" width="302.206" height="685" fill="#5D2626"/>
<rect x="938" y="324" width="302.206" height="685" fill="#5D2626"/>
<path d="M158.671 483.329C132.701 469.313 119.954 422.224 130.2 378.154L657.926 58.9712C668.171 14.9012 697.53 -9.46211 723.5 4.55412L958.5 142.5C984.47 156.516 1137.25 98.43 1127 142.5L997.229 612.792C986.983 656.862 957.625 681.225 931.655 667.209L158.671 483.329Z" fill="#D23434"/>
<circle cx="844" cy="926" r="150" fill="#D9D9D9"/>
</svg>`;

  // 초기 실행
  processSVG();
};

main();
