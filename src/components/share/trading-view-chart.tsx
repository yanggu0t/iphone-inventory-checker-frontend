import {
  CandlestickData,
  createChart,
  IChartApi,
  UTCTimestamp,
} from "lightweight-charts";
import { HTMLAttributes, useEffect, useRef } from "react";

interface ChartProps extends HTMLAttributes<HTMLDivElement> {
  data: CandlestickData[];
  theme: "light" | "dark";
}

function TradingViewChart({ data, theme, ...props }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        layout: {
          background: { color: theme === "dark" ? "#131722" : "#ffffff" },
          textColor: theme === "dark" ? "#D9D9D9" : "#191919",
          fontSize: 11,
          fontFamily: "'Trebuchet MS', Roboto, Ubuntu, sans-serif",
        },
        grid: {
          vertLines: {
            color: theme === "dark" ? "#363c4e" : "#E6E6E6",
            style: 1,
          },
          horzLines: {
            color: theme === "dark" ? "#363c4e" : "#E6E6E6",
            style: 1,
          },
        },
        crosshair: {
          mode: 1,
          vertLine: {
            width: 1,
            color: theme === "dark" ? "#758696" : "#9B9B9B",
            style: 1,
            labelBackgroundColor: theme === "dark" ? "#4c525e" : "#f2f3f5",
          },
          horzLine: {
            width: 1,
            color: theme === "dark" ? "#758696" : "#9B9B9B",
            style: 1,
            labelBackgroundColor: theme === "dark" ? "#4c525e" : "#f2f3f5",
          },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: true,
          borderColor: theme === "dark" ? "#363c4e" : "#C8C8C8",
          tickMarkFormatter: (time: UTCTimestamp) => {
            const date = new Date(time * 1000);
            const hours = date.getHours().toString().padStart(2, "0");
            const minutes = date.getMinutes().toString().padStart(2, "0");
            const seconds = date.getSeconds().toString().padStart(2, "0");
            return `${hours}:${minutes}:${seconds}`;
          },
        },
        rightPriceScale: {
          borderColor: theme === "dark" ? "#363c4e" : "#C8C8C8",
          scaleMargins: {
            top: 0.3,
            bottom: 0.25,
          },
        },
        handleScroll: {
          mouseWheel: true,
          pressedMouseMove: true,
          horzTouchDrag: true,
          vertTouchDrag: true,
        },
        handleScale: {
          axisPressedMouseMove: {
            time: true,
            price: true,
          },
          mouseWheel: true,
          pinch: true,
        },
      });

      const candleSeries = chart.addCandlestickSeries({
        upColor: "#26a69a",
        downColor: "#ef5350",
        borderVisible: false,
        wickUpColor: "#26a69a",
        wickDownColor: "#ef5350",
      });

      const formattedData = data.map((item) => ({
        ...item,
        time: Math.floor(new Date(item.time).getTime() / 1000) as UTCTimestamp,
      }));
      candleSeries.setData(formattedData);

      // 添加移動平均線
      const ma20Series = chart.addLineSeries({
        color: "rgba(255, 192, 0, 1)",
        lineWidth: 2,
      });

      // 計算並設置移動平均線數據
      const ma20Data = calculateMA(formattedData, 20);
      ma20Series.setData(ma20Data);

      chartRef.current = chart;

      // 添加工具列
      const toolbarHtml = `
        <div style="position: absolute; top: 12px; left: 12px; z-index: 100;">
          <button id="toggleMA">MA(20)</button>
          <button id="resetZoom">重置縮放</button>
        </div>
      `;
      chartContainerRef.current.insertAdjacentHTML("beforeend", toolbarHtml);

      // 綁定工具列按鈕事件
      document.getElementById("toggleMA")?.addEventListener("click", () => {
        ma20Series.applyOptions({
          visible: !ma20Series.options().visible,
        });
      });

      document.getElementById("resetZoom")?.addEventListener("click", () => {
        chart.timeScale().fitContent();
      });

      return () => {
        chart.remove();
      };
    }
  }, [data, theme]);

  return <div ref={chartContainerRef} {...props} />;
}

// 計算移動平均線
function calculateMA(data: CandlestickData[], period: number) {
  const result = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data
      .slice(i - period + 1, i + 1)
      .reduce((acc, cur) => acc + cur.close, 0);
    result.push({
      time: data[i].time,
      value: sum / period,
    });
  }
  return result;
}

export default TradingViewChart;
