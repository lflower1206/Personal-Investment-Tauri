import { useState, useMemo } from "react";
import { StockChart } from "./components/StockChart";
import { MockDataService } from "./services/MockDataService";
import "./App.css";

const STOCKS = [
  { symbol: "2330", name: "TSMC (台積電)" },
  { symbol: "0050", name: "Yuanta 50 (元大台灣50)" },
  { symbol: "2317", name: "Foxconn (鴻海)" },
];

function App() {
  const [selectedSymbol, setSelectedSymbol] = useState(STOCKS[0].symbol);

  // Use useMemo instead of useEffect + useState to avoid cascading renders
  const chartData = useMemo(() => {
    return MockDataService.getStockData(selectedSymbol, 120);
  }, [selectedSymbol]);

  const currentStock = useMemo(() => 
    STOCKS.find(s => s.symbol === selectedSymbol),
    [selectedSymbol]
  );

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Taiwan Stock Watch</h1>
            <p className="text-gray-500">Interactive Price & Volume Visualization</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="stock-select" className="text-sm font-medium text-gray-700">Select Asset</label>
            <select
              id="stock-select"
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-64 p-2.5 shadow-sm"
            >
              {STOCKS.map((stock) => (
                <option key={stock.symbol} value={stock.symbol}>
                  {stock.symbol} - {stock.name}
                </option>
              ))}
            </select>
          </div>
        </header>

        <section className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                TWSE
              </span>
              <h2 className="text-2xl font-bold text-gray-800">
                {currentStock?.symbol} <span className="text-gray-400 font-normal">| {currentStock?.name}</span>
              </h2>
            </div>
            
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ef5350]"></div>
                <span className="text-gray-600 font-medium">Up</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#26a69a]"></div>
                <span className="text-gray-600 font-medium">Down</span>
              </div>
            </div>
          </div>

          <StockChart data={chartData} />
          
          <div className="mt-4 text-xs text-gray-400 italic text-right">
            * Displaying synthetic data for development purposes.
          </div>
        </section>

        <footer className="mt-12 grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">Performance</h3>
            <p className="text-sm text-gray-500 line-clamp-2">Optimized with TradingView's lightweight-charts for smooth interactivity.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">Localization</h3>
            <p className="text-sm text-gray-500 line-clamp-2">Built-in support for Taiwanese market color conventions (Red=Up).</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">Interactivity</h3>
            <p className="text-sm text-gray-500 line-clamp-2">Real-time crosshair tracking and volume overlays enabled.</p>
          </div>
        </footer>
      </div>
    </main>
  );
}

export default App;
