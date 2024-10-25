import React, { useState, useEffect, useRef, useCallback } from "react";
import { performanceSubject } from "./programs/test";
import { updateCandleChart, updatePieChart } from "./chart";
import { Renderer } from "./Renderer";
import { ShapeRenderer } from "./ShapeRenderer";
/**
 * 초기 SVG 문자열
 */
const initialSvg = `<svg width="362" height="353" viewBox="0 0 362 353" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M180.849 0L211.592 121.662L325.879 69.8426L249.927 169.733L361.698 226.778L236.246 229.677L261.335 352.63L180.849 256.355L100.364 352.63L125.453 229.677L0 226.778L111.771 169.733L35.8194 69.8426L150.106 121.662L180.849 0Z" fill="#D9D9D9"/>
</svg>
`;

/**
 * App component
 * @returns {JSX.Element} App component
 */
const App: React.FC = () => {
  const [svgInput, setSvgInput] = useState<string>(initialSvg);
  const [scale, setScale] = useState<number>(50);
  const [roundness, setRoundness] = useState<number>(50);
  const [debug, setDebug] = useState<boolean>(false);
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
      <Renderer
        svgString={svgInput}
        scale={scale}
        roundness={roundness}
        debug={debug}
      />

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

          <label htmlFor="checkbox-debug">Debug</label>

          <input
            id="checkbox-debug"
            type="checkbox"
            checked={debug}
            onChange={(e) => setDebug(e.target.checked)}
          />
          <br />

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
