import { SvgProcessor } from "./paper-program";

const main = async () => {
  console.log("main start");
  const processor = new SvgProcessor();
  console.log("processor created");

  const updateResult = async ({
    scale,
    roundness,
  }: {
    scale: number;
    roundness: number;
  }) => {
    const result = await processor.run({ scale, roundness });
    const resultElement = document.getElementById("result");
    if (resultElement) {
      resultElement.innerHTML = "";
      resultElement.appendChild(result);
    }
  };

  const update = (value: number, labelElement: HTMLElement) => {
    labelElement.textContent = value.toString();
  };

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

  rangeScale?.addEventListener("input", (e: Event) => {
    if (labelScale) {
      update(Number((e.target as HTMLInputElement).value), labelScale);
      updateResult({
        roundness: Number(rangeRoundness.value),
        scale: Number((e.target as HTMLInputElement).value) / 100,
      });
    }
  });

  rangeRoundness?.addEventListener("input", (e: Event) => {
    if (labelRoundness) {
      update(Number((e.target as HTMLInputElement).value), labelRoundness);
      updateResult({
        roundness: Number((e.target as HTMLInputElement).value),
        scale: Number(rangeScale.value) / 100,
      });
    }
  });

  updateResult({ scale: 0.5, roundness: 50 });
};

main();
