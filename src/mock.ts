import type { LayerItem } from "./svg-engine/svgProcessor.context";

// export const mockSVGString = `<svg width="600" height="600" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M150 0L300 150L150 300L0 150L150 0Z" fill="#D9D9D9"/>
// <path d="M150 150C150 232.843 217.157 300 300 300C382.843 300 450 232.843 450 150H150Z" fill="#FF3838"/>
// <path d="M450 0L600 150L450 300L300 150L450 0Z" fill="#D9D9D9"/>
// <path d="M450 150C367.157 150 300 217.157 300 300C300 382.843 367.157 450 450 450L450 150Z" fill="#001BCE"/>
// <path d="M450 300L600 450L450 600L300 450L450 300Z" fill="#D9D9D9"/>
// </svg>
// `;

export const mockSVGString = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="47jjx8p881레이어_1" x="0px" y="0px" viewBox="0 0 100 100" xml:space="preserve" width="100px" height="100px" isInit="true" style="enable-background:new 0 0 100 100;">
<style type="text/css" isInit="true"/>
<g id="47jjx8p881폰트" isInit="true">
</g>
<rect x="46" y="42" width="54" height="16" fill="#70798f" origin_fill="#70798f" isInit="true"/>
<polygon points="49.74,100 61,88.69 30.44,58 49.87,58 49.87,42 30.85,42 61,11.31 49.74,0 0,50 " fill="#70798f" origin_fill="#70798f" isInit="true"/>
</svg>
`;

export const mockSVGString2 = `<svg width="580" height="910" viewBox="0 0 580 910" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 800V0L580 580H240L220 585L0 800Z" fill="white"/>
<path d="M455 835L275 910L40 355L225 280L455 835Z" fill="white"/>
</svg>
`;

// export const mockLayerData: LayerItem[] = [
//   {
//     id: "1",
//     bounds: {
//       x: 0,
//       y: 0,
//       width: 300,
//       height: 300,
//     },
//     strain: {
//       scale: {
//         x: 0,
//         y: 0,
//       },
//       position: {
//         x: 0,
//         y: 0,
//       },
//     },
//   },
//   {
//     id: "2",
//     bounds: {
//       x: 150,
//       y: 150,
//       width: 300,
//       height: 150,
//     },
//     strain: {
//       scale: {
//         x: 1,
//         y: 0,
//       },
//       position: {
//         x: 0,
//         y: 0,
//       },
//     },
//   },
//   {
//     id: "3",
//     bounds: {
//       x: 300,
//       y: 0,
//       width: 300,
//       height: 300,
//     },
//     strain: {
//       scale: {
//         x: 0,
//         y: 0,
//       },
//       position: {
//         x: 1,
//         y: 0,
//       },
//     },
//   },
//   {
//     id: "4",
//     bounds: {
//       x: 300,
//       y: 150,
//       width: 150,
//       height: 300,
//     },
//     strain: {
//       scale: {
//         x: 0,
//         y: 1,
//       },
//       position: {
//         x: 1,
//         y: 0,
//       },
//     },
//   },
//   {
//     id: "5",
//     bounds: {
//       x: 300,
//       y: 300,
//       width: 300,
//       height: 300,
//     },
//     strain: {
//       scale: {
//         x: 0,
//         y: 0,
//       },
//       position: {
//         x: 1,
//         y: 1,
//       },
//     },
//   },
// ];

export const mockLayerData: LayerItem[] = [
  {
    id: "GENSKV6BY4",
    bounds: {
      x: 46,
      y: 42,
      width: 54,
      height: 16,
    },
    strain: {
      scale: {
        x: 1,
        y: 0,
      },
      position: {
        x: 0,
        y: 0,
      },
    },
  },
  {
    id: "CJT4K8J2CG",
    bounds: {
      x: 0,
      y: 0,
      width: 61,
      height: 100,
    },
    strain: {
      scale: {
        x: 0,
        y: 0,
      },
      position: {
        x: 0,
        y: 0,
      },
    },
  },
];
