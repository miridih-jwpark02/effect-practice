import React, { useEffect, useState, useRef } from "react";
import { SvgProcessor } from "./svg-processor";
import { testProgram } from "./programs/test";

const processSVG = async (
  svgString: string,
  scale: number,
  roundness: number,
  displaySize?: {
    width: number;
    height: number;
  },
  debug?: boolean
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
      useCache: true,
      debug: debug ?? false,
    },
    testProgram
    // shapeProgram
  );

  return { svg, resourceSize: svgResourceSize, displaySize: svgDisplaySize };
};

export const Renderer: React.FC<{
  svgString: string;
  scale: number;
  roundness: number;
  debug: boolean;
}> = ({ svgString, scale, roundness, debug }) => {
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
    processSVG(svgString, scale, roundness, undefined, debug).then(
      ({ svg, resourceSize, displaySize }) => {
        if (svgRef.current) {
          svgRef.current.innerHTML = "";
          svgRef.current.appendChild(svg);
        }
        setResourceSize(resourceSize);
        setDisplaySize(displaySize);
      }
    );
  }, [svgString, scale, roundness]);

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
