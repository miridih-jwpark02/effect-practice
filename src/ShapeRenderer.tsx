import React, { useEffect, useState, useRef } from "react";
import { SvgProcessor } from "./svg-processor";
import { shapeProgram } from "./programs/shape";

const processSVG = async (
  svgString: string,
  scale: number,
  roundness: number,
  displaySize?: {
    width: number;
    height: number;
  }
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
    },
    shapeProgram
  );

  return svg;
};

export const ShapeRenderer: React.FC<{
  svgString: string;
  scale: number;
  roundness: number;
}> = ({ svgString, scale, roundness }) => {
  const svgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    processSVG(svgString, scale, roundness).then((svg) => {
      if (svgRef.current) {
        svgRef.current.innerHTML = "";
        svgRef.current.appendChild(svg);
      }
    });
  }, [svgString, scale, roundness]);

  return <div id="shape-result" ref={svgRef}></div>;
};
