import { useState, useMemo } from "react";
import { StockChart } from "./components/StockChart";
import { MockDataService } from "./services/MockDataService";
import { TICKER_COLORS } from "./constants";
import "./App.css";

const STOCKS = [
  { symbol: "2330", name: "TSMC (台積電)" },
  { symbol: "0050", name: "Yuanta 50 (元大台灣50)" },
  { symbol: "2317", name: "Foxconn (鴻海)" },
  { symbol: "2454", name: "MediaTek (聯發科)" },
  { symbol: "2308", name: "Delta Electronics (台達電)" },
  { symbol: "2603", name: "Evergreen Marine (長榮)" },
];

function App() {
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([STOCKS[0].symbol]);
  const [comparisonMode, setComparisonMode] = useState<'percent' | 'absolute'>('percent');

  // Load and cache mock data for all selected symbols
  const chartDataMap = useMemo(() => {
    const map: Record<string, ReturnType<typeof MockDataService.getStockData>> = {};
    selectedSymbols.forEach((symbol) => {
      map[symbol] = MockDataService.getStockData(symbol, 120);
    });
    return map;
  }, [selectedSymbols]);

  const currentStock = useMemo(() => 
    STOCKS.find(s => s.symbol === selectedSymbols[0]),
    [selectedSymbols]
  );

  const toggleSymbol = (symbol: string) => {
    setSelectedSymbols((prev) => {
      if (prev.includes(symbol)) {
        if (prev.length === 1) return prev; // Must have at least one stock selected
        return prev.filter((s) => s !== symbol);
      } else {
        if (prev.length >= 5) return prev; // Limit to maximum 5 stocks
        return [...prev, symbol];
      }
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Taiwan Stock Watch</h1>
            <p className="text-gray-500">Interactive Price & Volume Visualization</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Compare Assets (Select up to 5)</span>
            <div className="flex flex-wrap gap-2 max-w-lg">
              {STOCKS.map((stock) => {
                const isSelected = selectedSymbols.includes(stock.symbol);
                const selectedIndex = selectedSymbols.indexOf(stock.symbol);
                const color = isSelected ? TICKER_COLORS[selectedIndex % TICKER_COLORS.length] : undefined;
                const isDisabled = !isSelected && selectedSymbols.length >= 5;

                return (
                  <button
                    key={stock.symbol}
                    onClick={() => toggleSymbol(stock.symbol)}
                    disabled={isDisabled}
                    className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'text-white border-transparent shadow-sm'
                        : isDisabled
                        ? 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 cursor-pointer'
                    }`}
                    style={isSelected ? { backgroundColor: color } : {}}
                  >
                    {isSelected ? '✓ ' : ''}{stock.symbol} - {stock.name.split(" ")[0]}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        <section className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                TWSE
              </span>
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedSymbols.length === 1 ? (
                  <>
                    {currentStock?.symbol} <span className="text-gray-400 font-normal">| {currentStock?.name}</span>
                  </>
                ) : (
                  "Performance Comparison"
                )}
              </h2>
            </div>
            
            <div className="flex items-center gap-6">
              {selectedSymbols.length > 1 && (
                <div className="flex rounded-lg overflow-hidden border border-gray-200 p-0.5 bg-gray-50 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setComparisonMode('percent')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      comparisonMode === 'percent'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    % Return
                  </button>
                  <button
                    type="button"
                    onClick={() => setComparisonMode('absolute')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      comparisonMode === 'absolute'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    $ Price
                  </button>
                </div>
              )}

              <div className="flex flex-wrap gap-4 text-sm">
                {selectedSymbols.length === 1 ? (
                  <>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#ef5350]"></div>
                      <span className="text-gray-600 font-medium">Up</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#26a69a]"></div>
                      <span className="text-gray-600 font-medium">Down</span>
                    </div>
                  </>
                ) : (
                  selectedSymbols.map((sym, index) => {
                    const stock = STOCKS.find(s => s.symbol === sym);
                    return (
                      <div key={sym} className="flex items-center gap-1.5">
                        <div
                          className="w-3 h-3 rounded-full shadow-sm"
                          style={{ backgroundColor: TICKER_COLORS[index % TICKER_COLORS.length] }}
                        ></div>
                        <span className="text-gray-600 font-medium text-xs">
                          {sym} - {stock?.name.split(" ")[0]}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <StockChart
            dataMap={chartDataMap}
            selectedSymbols={selectedSymbols}
            comparisonMode={comparisonMode}
          />
          
          <div className="mt-4 text-xs text-gray-400 italic text-right">
            * Displaying synthetic data for development purposes.
          </div>
        </section>

        <footer className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
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
