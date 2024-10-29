import React, { useState, useEffect, useRef, useCallback } from "react";
import { performanceSubject as stretchablePerformanceSubject } from "./programs/stretchable-test";
import {
  performanceSubject,
  performanceSubject as rendererPerformanceSubject,
} from "./programs/test";
import { updateCandleChart, updatePieChart } from "./chart";
// import { Renderer } from "./Renderer";
// import { ShapeRenderer } from "./ShapeRenderer";
import { mockSVGString, mockSVGString2 } from "./mock";
import { StretchableRenderer } from "./StretchableRenderer";
import { Renderer } from "./Renderer";

/**
 * SVG string에서 <svg> 태그와 그 내용을 추출
 * @param rawString - SVG string이 포함된 문자열
 * @returns SVG 태그와 그 내용을 포함한 문자열
 */
const extractPureSVGString = (rawString: string): string | Error => {
  const svgRegex = /<svg[\s\S]*?<\/svg>/i;
  const match = rawString.match(svgRegex);
  return match ? match[0] : new Error("No SVG found");
};

/**
 * App component
 * @returns {JSX.Element} App component
 */
const App: React.FC = () => {
  const [svgInput, setSvgInput] = useState<string>(mockSVGString2);
  const [deltaWidth, setDeltaWidth] = useState<number>(0);
  const [deltaHeight, setDeltaHeight] = useState<number>(0);
  const [scaleX, setScaleX] = useState<number>(100);
  const [scaleY, setScaleY] = useState<number>(100);
  const [roundness, setRoundness] = useState<number>(50);
  const [style, setStyle] = useState<{
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
  }>({});
  const [debug, setDebug] = useState<boolean>(false);
  const [mode, setMode] = useState<"stretchable" | "renderer">("renderer");
  const resultElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const subscription = (
      mode === "stretchable"
        ? stretchablePerformanceSubject
        : rendererPerformanceSubject
    ).subscribe((performanceResult) => {
      updateCandleChart(performanceResult);
      updatePieChart(performanceResult);
    });

    return () => subscription.unsubscribe();
  }, [mode]);

  const handleSvgInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSvgInput(e.target.value);
  };

  /**
   * SVG element의 random animation을 처리
   * @param currentValue - 현재 값
   * @param speed - 변화 속도
   * @param range - [최소값, 최대값] 튜플
   * @returns {[number, number]} [새로운 값, 새로운 속도]
   */
  const calculateNextValue = (
    currentValue: number,
    speed: number,
    range: [number, number]
  ): [number, number] => {
    const [minValue, maxValue] = range;
    const nextValue = currentValue + speed;

    if (nextValue > maxValue) {
      return [maxValue, -speed];
    }
    if (nextValue < minValue) {
      return [minValue, -speed];
    }
    return [nextValue, speed];
  };

  const handleRandomAutoAnimation = useCallback(() => {
    const startTime = Date.now();
    const ANIMATION_DURATION = 10000; // 10초

    // Property ranges as tuples: [minValue, maxValue]
    const ranges: [number, number][] = [
      [50, 300], // scaleX
      [50, 300], // scaleY
      [0, 100], // roundness
      [0, 300], // deltaWidth
      [0, 300], // deltaHeight
    ];

    // Random speed 초기화
    const speeds = Array.from(
      { length: 5 },
      () => Math.floor(Math.random() * 10) - 5
    );

    const animate = () => {
      const currentTime = Date.now();
      if (currentTime - startTime > ANIMATION_DURATION) {
        return;
      }

      // 현재 값들을 state에서 직접 가져오지 않고 함수형 업데이트 사용
      setScaleX((prevScaleX) => {
        const [newValue, newSpeed] = calculateNextValue(
          prevScaleX,
          speeds[0],
          ranges[0]
        );
        speeds[0] = newSpeed;
        return newValue;
      });
      setScaleY((prevScaleY) => {
        const [newValue, newSpeed] = calculateNextValue(
          prevScaleY,
          speeds[1],
          ranges[1]
        );
        speeds[1] = newSpeed;
        return newValue;
      });
      setRoundness((prevRoundness) => {
        const [newValue, newSpeed] = calculateNextValue(
          prevRoundness,
          speeds[2],
          ranges[2]
        );
        speeds[2] = newSpeed;
        return newValue;
      });
      setDeltaWidth((prevDeltaWidth) => {
        const [newValue, newSpeed] = calculateNextValue(
          prevDeltaWidth,
          speeds[3],
          ranges[3]
        );
        speeds[3] = newSpeed;
        return newValue;
      });
      setDeltaHeight((prevDeltaHeight) => {
        const [newValue, newSpeed] = calculateNextValue(
          prevDeltaHeight,
          speeds[4],
          ranges[4]
        );
        speeds[4] = newSpeed;
        return newValue;
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []); // useCallback으로 함수 메모이제이션
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
      {mode === "renderer" && (
        <Renderer
          svgString={
            extractPureSVGString(svgInput) instanceof Error
              ? mockSVGString
              : (extractPureSVGString(svgInput) as string)
          }
          deltaWidth={deltaWidth}
          deltaHeight={deltaHeight}
          scale={{
            x: scaleX,
            y: scaleY,
          }}
          roundness={roundness}
          style={style}
          debug={debug}
        />
      )}
      {mode === "stretchable" && (
        <StretchableRenderer
          svgString={
            extractPureSVGString(svgInput) instanceof Error
              ? mockSVGString
              : (extractPureSVGString(svgInput) as string)
          }
          deltaWidth={deltaWidth}
          deltaHeight={deltaHeight}
          scale={{
            x: scaleX,
            y: scaleY,
          }}
          roundness={roundness}
          style={style}
          debug={debug}
        />
      )}

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
          <select
            id="mode"
            value={mode}
            onChange={(e) => {
              setMode(e.target.value as "stretchable" | "renderer");
              setSvgInput(mode === "renderer" ? mockSVGString : mockSVGString2);
            }}
          >
            <option value="stretchable">Stretchable</option>
            <option value="renderer">Renderer</option>
          </select>
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

          <label htmlFor="range-deltaWidth">ΔWidth</label>
          <input
            id="range-deltaWidth"
            type="range"
            min="0"
            max="300"
            value={deltaWidth}
            onChange={(e) => setDeltaWidth(Number(e.target.value))}
          />
          <label id="label-deltaWidth">{deltaWidth} px</label>

          <label htmlFor="range-deltaHeight">ΔHeight</label>
          <input
            id="range-deltaHeight"
            type="range"
            min="0"
            max="300"
            value={deltaHeight}
            onChange={(e) => setDeltaHeight(Number(e.target.value))}
          />
          <label id="label-deltaHeight">{deltaHeight} px</label>

          <label htmlFor="range-scaleX">Scale X</label>
          <input
            id="range-scaleX"
            type="range"
            min="50"
            max="300"
            value={scaleX}
            onChange={(e) => setScaleX(Number(e.target.value))}
          />
          <label id="label-scaleX">{scaleX}%</label>

          <label htmlFor="range-scaleY">Scale Y</label>
          <input
            id="range-scaleY"
            type="range"
            min="50"
            max="300"
            value={scaleY}
            onChange={(e) => setScaleY(Number(e.target.value))}
          />
          <label id="label-scaleY">{scaleY}%</label>

          <label htmlFor="range-roundness">Roundness</label>
          <input
            id="range-roundness"
            type="range"
            min="0"
            max="100"
            value={roundness}
            onChange={(e) => setRoundness(Number(e.target.value))}
          />
          <label id="label-roundness">{roundness}%</label>

          <label htmlFor="range-fillColor">Fill Color</label>
          <input
            id="range-fillColor"
            type="color"
            value={style.fillColor}
            onChange={(e) => setStyle({ ...style, fillColor: e.target.value })}
          />
          <label id="label-fillColor">{style.fillColor}</label>

          <label htmlFor="range-strokeColor">Stroke Color</label>
          <input
            id="range-strokeColor"
            type="color"
            value={style.strokeColor}
            onChange={(e) =>
              setStyle({ ...style, strokeColor: e.target.value })
            }
          />
          <label id="label-strokeColor">{style.strokeColor}</label>

          <label htmlFor="range-strokeWidth">Stroke Width</label>
          <input
            id="range-strokeWidth"
            type="range"
            min="0"
            max="100"
            value={style.strokeWidth}
            onChange={(e) =>
              setStyle({ ...style, strokeWidth: Number(e.target.value) })
            }
          />
          <label id="label-strokeWidth">{style.strokeWidth}</label>
          <button
            id="button-randomAutoAnimation"
            onClick={() => {
              handleRandomAutoAnimation();
            }}
          >
            Random Auto Animation
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
