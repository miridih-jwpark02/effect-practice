import { program } from "./paper-program";

const main = async ({ scale = 0.5 }: { scale?: number }) => {
  const result = await program({ scale });

  const resultElement = document.getElementById("result");
  if (resultElement) {
    resultElement.innerHTML = "";
    resultElement.appendChild(result);
  }
};

const update = (value: number, labelElement: HTMLElement) => {
  labelElement.textContent = value.toString();
};

const range = document.getElementById("range");
const label = document.getElementById("label");
range?.addEventListener("input", (e: Event) => {
  if (label) {
    update(Number((e.target as HTMLInputElement).value), label);
    main({ scale: Number((e.target as HTMLInputElement).value) / 100 });
  }
});

main({ scale: 0.5 });
