import TradingViewWidget from "@/components/share/trading-view-chart";
import { Outlet } from "@tanstack/react-router";

const AppLayout = () => {
  const generateCandleData = (count: number) => {
    const data = [];
    const now = new Date();
    let price = 100;

    for (let i = 0; i < count; i++) {
      const time = new Date(now.getTime() - (count - i) * 1000);
      const open = price;
      const high = open + Math.random() * 2;
      const low = open - Math.random() * 2;
      const close = low + Math.random() * (high - low);

      data.push({
        time: time.toISOString(),
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
      });

      price = close;
    }

    return data;
  };

  const candleData = generateCandleData(120); // 生成最近60秒的數據

  return (
    <div className="flex h-full w-full flex-col">
      <TradingViewWidget
        className="h-full w-full"
        theme="light"
        data={candleData}
      />
    </div>
  );
};

export { AppLayout };
