import React, { useEffect, useState, useRef } from "react";
import { SvgProcessor } from "./svg-processor";
import { testProgram } from "./programs/test";

const processSVG = async (
  svgString: string,
  scale: {
    x: number;
    y: number;
  },
  roundness: number,
  deltaWidth: number,
  deltaHeight: number,
  displaySize?: {
    width: number;
    height: number;
  },
  debug?: boolean,
  style?: {
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
  }
) => {
  const svgElement = new DOMParser().parseFromString(
    svgString,
    "image/svg+xml"
  );

  const width = svgElement.documentElement.getAttribute("width");
  const height = svgElement.documentElement.getAttribute("height");

  const svgResourceSize = {
    width: parseFloat(width ?? "0"),
    height: parseFloat(height ?? "0"),
  };

  const svgDisplaySize = displaySize ?? {
    width: svgResourceSize.width * scale.x + deltaWidth,
    height: svgResourceSize.height * scale.y + deltaHeight,
  };

  const svgProcessor = new SvgProcessor();

  const svg = await svgProcessor.run(
    {
      svgString,
      roundness,
      scale,
      resourceSize: svgResourceSize,
      displaySize: svgDisplaySize,
      useCache: true,
      debug: debug ?? false,
      style: style,
    },
    testProgram
    // shapeProgram
  );

  return { svg, resourceSize: svgResourceSize, displaySize: svgDisplaySize };
};

export const Renderer: React.FC<{
  svgString: string;
  scale: {
    x: number;
    y: number;
  };
  roundness: number;
  debug: boolean;
  deltaWidth: number;
  deltaHeight: number;
  style?: {
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
  };
}> = ({
  svgString,
  scale,
  roundness,
  debug,
  deltaWidth,
  deltaHeight,
  style,
}) => {
  const svgRef = useRef<HTMLDivElement>(null);
  const [resourceSize, setResourceSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const [displaySize, setDisplaySize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  useEffect(() => {
    processSVG(
      svgString,
      scale,
      roundness,
      deltaWidth,
      deltaHeight,
      undefined,
      debug,
      style
    ).then(({ svg, resourceSize, displaySize }) => {
      if (svgRef.current) {
        svgRef.current.innerHTML = "";
        svgRef.current.appendChild(svg);
      }
      setResourceSize(resourceSize);
      setDisplaySize(displaySize);
    });
  }, [svgString, scale, roundness, deltaWidth, deltaHeight, style]);

  return (
    <div style={{ position: "relative" }}>
      <div id="result">
        <div ref={svgRef}></div>
        <div id="debug-info">
          <div>
            resourceSize: {resourceSize.width} x {resourceSize.height}
          </div>
          <div>
            displaySize: {displaySize.width} x {displaySize.height}
          </div>
        </div>
      </div>
    </div>
  );
};
