import React, { useState, useEffect, useRef, useCallback } from "react";
import { performanceSubject } from "./programs/test";
import { updateCandleChart, updatePieChart } from "./chart";
import { Renderer } from "./Renderer";
import { ShapeRenderer } from "./ShapeRenderer";
/**
 * 초기 SVG 문자열
 */
const initialSvg = `<svg width="1241" height="1076" viewBox="0 0 1241 1076" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="455" y="324" width="520" height="685" fill="#5D2626"/>
<rect y="324" width="302.206" height="685" fill="#5D2626"/>
<rect x="938" y="324" width="302.206" height="685" fill="#5D2626"/>
<path d="M158.671 483.329C132.701 469.313 119.954 422.224 130.2 378.154L657.926 58.9712C668.171 14.9012 697.53 -9.46211 723.5 4.55412L958.5 142.5C984.47 156.516 1137.25 98.43 1127 142.5L997.229 612.792C986.983 656.862 957.625 681.225 931.655 667.209L158.671 483.329Z" fill="#D23434"/>
<circle cx="844" cy="926" r="150" fill="#D9D9D9"/>
</svg>`;

/**
 * App component
 * @returns {JSX.Element} App component
 */
const App: React.FC = () => {
  const [svgInput, setSvgInput] = useState<string>(initialSvg);
  const [scale, setScale] = useState<number>(50);
  const [roundness, setRoundness] = useState<number>(50);
  const resultElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const subscription = performanceSubject.subscribe((performanceResult) => {
      updateCandleChart(performanceResult);
      updatePieChart(performanceResult);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSvgInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSvgInput(e.target.value);
  };

  return (
    <div
      id="container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Renderer svgString={svgInput} scale={scale} roundness={roundness} />

      {/* <ShapeRenderer svgString={svgInput} scale={scale} roundness={roundness} /> */}

      <div id="charts-container">
        <div id="candleChart"></div>
        <div id="pieChart"></div>
      </div>
      <div id="controls-container">
        <div
          id="controls"
          className="controls-grid"
          style={{ padding: "10px", boxSizing: "border-box" }}
        >
          <textarea
            id="svg-input"
            placeholder="SVG 코드를 여기에 붙여넣으세요"
            value={svgInput}
            onChange={handleSvgInputChange}
          />

          <label htmlFor="range-scale">Scale</label>
          <input
            id="range-scale"
            type="range"
            min="50"
            max="300"
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
          />
          <label id="label-scale">{scale}</label>

          <label htmlFor="range-roundness">Roundness</label>
          <input
            id="range-roundness"
            type="range"
            min="0"
            max="100"
            value={roundness}
            onChange={(e) => setRoundness(Number(e.target.value))}
          />
          <label id="label-roundness">{roundness}</label>
        </div>
      </div>
    </div>
  );
};

export default App;
