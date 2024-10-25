import { PerformanceResult } from "./programs/test";
import * as d3 from "d3";

/**
 * D3를 사용한 캔들스틱 차트 생성 및 업데이트
 * @param performanceResult - 성능 측정 결과
 */
export function updateCandleChart(performanceResult: PerformanceResult) {
  const margin = { top: 20, right: 30, bottom: 20, left: 60 };
  const width = 400 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  // Data 준비
  const data = Object.entries(performanceResult.steps)
    .filter(([step]) => step !== "total")
    .map(([step, times], index) => ({
      step: `Task ${index + 1}`,
      low: Math.min(...times),
      open: percentile(times, 25),
      close: percentile(times, 75),
      high: Math.max(...times),
      average: times.reduce((a, b) => a + b, 0) / times.length,
    }));

  // SVG 생성 또는 선택
  const svg = d3
    .select("#candleChart")
    .selectAll("svg")
    .data([null])
    .join("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .selectAll("g")
    .data([null])
    .join("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Scales 설정
  const x = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.high) ?? 0])
    .range([0, width]);

  const y = d3
    .scaleBand()
    .domain(data.map((d) => d.step).reverse())
    .range([height, 0])
    .padding(0.2);

  // Axes 그리기
  svg
    .selectAll(".x-axis")
    .data([null])
    .join("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x) as any)
    .append("text")
    .attr("class", "axis-label")
    .attr("x", width)
    .attr("y", 40)
    .attr("text-anchor", "end")
    .attr("fill", "white")
    .text("Time (ms)");

  svg
    .selectAll(".y-axis")
    .data([null])
    .join("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y) as any)
    .append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", 0)
    .attr("text-anchor", "end")
    .attr("fill", "white")
    .text("Processing Steps");

  // Candlesticks 그리기
  const candlesticks = svg
    .selectAll(".candlestick")
    .data(data)
    .join("g")
    .attr("class", "candlestick")
    .attr("transform", (d) => `translate(0,${y(d.step)})`);

  candlesticks
    .selectAll("line")
    .data((d) => [d])
    .join("line")
    .attr("x1", (d) => x(d.low))
    .attr("x2", (d) => x(d.high))
    .attr("y1", y.bandwidth() / 2)
    .attr("y2", y.bandwidth() / 2)
    .attr("stroke", "white")
    .attr("stroke-width", 1);

  candlesticks
    .selectAll("rect")
    .data((d) => [d])
    .join("rect")
    .attr("x", (d) => x(Math.min(d.open, d.close)))
    .attr("y", 0)
    .attr("width", (d) => Math.abs(x(d.open) - x(d.close)))
    .attr("height", y.bandwidth())
    .attr("fill", (d) => (d.open > d.close ? "red" : "green"));

  // Average line 그리기
  candlesticks
    .selectAll(".average-line")
    .data((d) => [d])
    .join("line")
    .attr("class", "average-line")
    .attr("x1", (d) => x(d.average))
    .attr("x2", (d) => x(d.average))
    .attr("y1", 0)
    .attr("y2", y.bandwidth())
    .attr("stroke", "blue")
    .attr("stroke-width", 2);

  // Average value 표시
  candlesticks
    .selectAll(".average-text")
    .data((d) => [d])
    .join("text")
    .attr("class", "average-text")
    .attr("x", (d) => x(d.average) + 5)
    .attr("y", (d) => y.bandwidth() / 2 + 10)
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .attr("font-size", "10px")
    .attr("fill", "white")
    .text((d) => `${d.average.toFixed(2)} ms`);
}

/**
 * D3를 사용한 파이 차트 생성 및 업데이트
 * @param performanceResult - 성능 측정 결과
 */
export function updatePieChart(performanceResult: PerformanceResult): void {
  const margin = { top: 20, right: 220, bottom: 20, left: 20 };
  const width = 600 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;
  const radius = Math.min(width, height) / 2;

  // 데이터 준비
  const data = Object.entries(performanceResult.steps)
    .filter(([step]) => step !== "total")
    .map(([step, times], index) => ({
      label: `${index + 1}. ${step}`,
      value: times.reduce((a, b) => a + b, 0) / times.length,
    }));

  // Color scale 설정
  const color = d3
    .scaleOrdinal(d3.schemeCategory10)
    .domain(data.map((d) => d.label));

  // SVG 생성 또는 선택
  const svg = d3
    .select("#pieChart")
    .selectAll("svg")
    .data([null])
    .join("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .selectAll("g")
    .data([null])
    .join("g")
    .attr(
      "transform",
      `translate(${width / 2 + margin.left},${height / 2 + margin.top})`
    );

  // Pie layout 생성
  const pie = d3
    .pie<{ label: string; value: number }>()
    .value((d) => d.value)
    .sort(null);

  // Arc generator 생성
  const arc = d3
    .arc<d3.PieArcDatum<{ label: string; value: number }>>()
    .innerRadius(0)
    .outerRadius(radius);

  // Pie segments 생성
  const arcs = svg
    .selectAll(".arc")
    .data(pie(data))
    .join("g")
    .attr("class", "arc");

  arcs
    .selectAll("path")
    .data((d) => [d])
    .join("path")
    .attr("d", arc)
    .attr("fill", (d) => color(d.data.label));

  // Labels 추가
  arcs
    .selectAll("text")
    .data((d) => [d])
    .join("text")
    .attr("transform", (d) => `translate(${arc.centroid(d)})`)
    .attr("dy", ".35em")
    .attr("font-size", "15px")
    .attr("fill", "white")
    .style("text-anchor", "middle")
    .text((d) => d.data.label.split(".")[0]);

  // Total 값 계산
  const total = data.reduce((sum, d) => sum + d.value, 0);

  // Legend 및 Total 추가
  const legendGroup = svg
    .selectAll(".legend-group")
    .data([null])
    .join("g")
    .attr("class", "legend-group")
    .attr("transform", `translate(${radius + 20},${-radius})`);

  const legendItems = legendGroup
    .selectAll(".legend")
    .data(data)
    .join("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => `translate(0,${i * 20})`);

  legendItems
    .selectAll("rect")
    .data((d) => [d])
    .join("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", (d) => color(d.label));

  legendItems
    .selectAll("text")
    .data((d) => [d])
    .join("text")
    .attr("x", 15)
    .attr("y", 9)
    .attr("font-size", "12px")
    .attr("fill", "white")
    .text((d) => `${d.label}: ${d.value.toFixed(2)} ms`);

  // Total 표시 (legend의 맨 아래에)
  legendGroup
    .append("text")
    .attr("class", "total-text")
    .attr("x", 0)
    .attr("y", data.length * 20 + 15)
    .attr("font-size", "14px")
    .attr("font-weight", "bold")
    .attr("fill", "white")
    .text(`Total: ${total.toFixed(2)} ms`);
}

/**
 * 백분위수 계산
 * @param arr - 숫자 배열
 * @param p - 백분위수 (0-100)
 */
function percentile(arr: number[], p: number) {
  const sorted = arr.slice().sort((a, b) => a - b);
  const position = ((sorted.length - 1) * p) / 100;
  const base = Math.floor(position);
  const rest = position - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  } else {
    return sorted[base];
  }
}
