import { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData, HistogramData, LineData, CandlestickSeries, HistogramSeries, LineSeries, MouseEventParams, Time } from 'lightweight-charts';
import { OHLCV } from '../services/MockDataService';
import { TICKER_COLORS } from '../constants';

interface StockChartProps {
  dataMap: Record<string, OHLCV[]>;
  selectedSymbols: string[];
  comparisonMode: 'percent' | 'absolute';
  colors?: {
    upColor?: string;
    downColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
}

export const StockChart = ({
  dataMap,
  selectedSymbols,
  comparisonMode,
  colors: {
    upColor = '#ef5350', // TW Red for Up
    downColor = '#26a69a', // TW Green/Teal for Down
    backgroundColor = 'transparent',
    textColor = '#333',
  } = {},
}: StockChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  
  // Track active series for dynamic cleanup
  const activeSeriesRef = useRef<ISeriesApi<'Candlestick' | 'Histogram' | 'Line'>[]>([]);
  
  // Refs for specific series to access them in the crosshair callback
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const lineSeriesMapRef = useRef<Record<string, ISeriesApi<'Line'>>>({});
  const toolTipRef = useRef<HTMLDivElement | null>(null);

  // 1. Initialize Chart instance & handle window resizes
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const container = chartContainerRef.current;
    
    // Create custom glassmorphism floating tooltip element
    const toolTip = document.createElement('div');
    toolTip.className = 'floating-tooltip';
    Object.assign(toolTip.style, {
      width: '210px',
      position: 'absolute',
      display: 'none',
      padding: '12px',
      boxSizing: 'border-box',
      fontSize: '12px',
      textAlign: 'left',
      zIndex: '100',
      top: '12px',
      left: '12px',
      pointerEvents: 'none',
      border: '1px solid rgba(240, 240, 240, 0.8)',
      borderRadius: '12px',
      background: 'rgba(255, 255, 255, 0.95)',
      color: '#1a1a1a',
      boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
      backdropFilter: 'blur(8px)',
      fontFamily: 'monospace',
      transition: 'left 0.05s ease-out, top 0.05s ease-out',
    });
    container.appendChild(toolTip);
    toolTipRef.current = toolTip;

    const handleResize = () => {
      chartRef.current?.applyOptions({ width: container.clientWidth });
    };

    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: container.clientWidth,
      height: 400,
      grid: {
        vertLines: { color: '#f5f5f5' },
        horzLines: { color: '#f5f5f5' },
      },
      crosshair: {
        mode: 0,
      },
      timeScale: {
        borderColor: '#eee',
      },
    });

    chartRef.current = chart;
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      if (container.contains(toolTip)) {
        container.removeChild(toolTip);
      }
      chartRef.current = null;
    };
  }, [backgroundColor, textColor]);

  // 2. Dynamically rebuild Series when data, selection, or mode changes
  useEffect(() => {
    const chart = chartRef.current;
    const toolTip = toolTipRef.current;
    if (!chart || !toolTip || !chartContainerRef.current) return;

    // Reset tooltip visibility on series/mode changes to prevent stale overlays
    toolTip.style.display = 'none';

    const container = chartContainerRef.current;

    // Clean up any previously active series
    activeSeriesRef.current.forEach((series) => {
      try {
        chart.removeSeries(series);
      } catch {
        // Safe check in case series was already deleted
      }
    });
    activeSeriesRef.current = [];
    candlestickSeriesRef.current = null;
    volumeSeriesRef.current = null;
    lineSeriesMapRef.current = {};

    // Check if we have valid data to render
    const hasData = selectedSymbols.some(sym => dataMap[sym] && dataMap[sym].length > 0);
    if (!hasData) return;

    if (selectedSymbols.length === 1) {
      // --- SINGLE SYMBOL: Candlestick + Volume Chart ---
      const symbol = selectedSymbols[0];
      const symbolData = dataMap[symbol] || [];

      // Create Candlestick series
      const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor,
        downColor,
        borderVisible: false,
        wickUpColor: upColor,
        wickDownColor: downColor,
      });
      candlestickSeriesRef.current = candlestickSeries;
      activeSeriesRef.current.push(candlestickSeries);

      // Create Volume series (Histogram)
      const volumeSeries = chart.addSeries(HistogramSeries, {
        color: downColor,
        priceFormat: { type: 'volume' },
        priceScaleId: '', // Overlay series on the main scale
      });
      volumeSeriesRef.current = volumeSeries;
      activeSeriesRef.current.push(volumeSeries);

      volumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.8, // Place volume at the bottom 20% of the chart
          bottom: 0,
        },
      });

      // Bind data to single view series
      const candlestickData: CandlestickData[] = symbolData.map((d) => ({
        time: d.time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }));

      const volumeData: HistogramData[] = symbolData.map((d) => ({
        time: d.time,
        value: d.volume,
        color: d.close >= d.open ? upColor : downColor,
      }));

      candlestickSeries.setData(candlestickData);
      volumeSeries.setData(volumeData);
    } else {
      // --- MULTIPLE SYMBOLS: Performance Line Comparison Chart ---
      const tempLineMap: Record<string, ISeriesApi<'Line'>> = {};

      selectedSymbols.forEach((symbol, index) => {
        const symbolData = dataMap[symbol] || [];
        if (symbolData.length === 0) return;

        const lineColor = TICKER_COLORS[index % TICKER_COLORS.length];
        
        // Add a line series for each compared ticker
        const lineSeries = chart.addSeries(LineSeries, {
          color: lineColor,
          lineWidth: 2,
          priceFormat: comparisonMode === 'percent' 
            ? { type: 'custom', formatter: (val: number) => `${val >= 0 ? '+' : ''}${val.toFixed(1)}%` }
            : undefined,
        });

        tempLineMap[symbol] = lineSeries;
        activeSeriesRef.current.push(lineSeries);

        // Normalize or plot absolute price values
        const plotData: LineData[] = comparisonMode === 'percent'
          ? (() => {
              const basePrice = symbolData[0].close;
              return symbolData.map((d) => ({
                time: d.time,
                value: ((d.close - basePrice) / basePrice) * 100,
              }));
            })()
          : symbolData.map((d) => ({
              time: d.time,
              value: d.close,
            }));

        lineSeries.setData(plotData);
      });

      lineSeriesMapRef.current = tempLineMap;
    }

    // Bind crosshair interaction callback
    const handleCrosshairMove = (param: MouseEventParams<Time>) => {
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > container.clientWidth ||
        param.point.y < 0 ||
        param.point.y > 400
      ) {
        toolTip.style.display = 'none';
      } else {
        toolTip.style.display = 'block';
        const dateStr = param.time as string;
        
        let tooltipHTML = `<div style="color: #666; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 6px; font-weight: bold">${dateStr}</div>`;
        
        if (selectedSymbols.length === 1) {
          // --- Tooltip for Single Candlestick Chart ---
          const candleSeries = candlestickSeriesRef.current;
          const volSeries = volumeSeriesRef.current;
          
          if (candleSeries && volSeries) {
            const candleData = param.seriesData.get(candleSeries) as CandlestickData | undefined;
            const volData = param.seriesData.get(volSeries) as HistogramData | undefined;
            
            if (candleData && candleData.open !== undefined && candleData.high !== undefined && candleData.low !== undefined && candleData.close !== undefined) {
              const isUp = candleData.close >= candleData.open;
              tooltipHTML += `
                <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                  <span>Open:</span>
                  <span style="font-weight: bold">${candleData.open.toFixed(1)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                  <span>High:</span>
                  <span style="font-weight: bold; color: ${upColor}">${candleData.high.toFixed(1)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                  <span>Low:</span>
                  <span style="font-weight: bold; color: ${downColor}">${candleData.low.toFixed(1)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span>Close:</span>
                  <span style="font-weight: bold; color: ${isUp ? upColor : downColor}">${candleData.close.toFixed(1)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding-top: 6px; border-top: 1px solid #eee;">
                  <span>Volume:</span>
                  <span style="font-weight: bold">${(volData?.value || 0).toLocaleString()}</span>
                </div>
              `;
            }
          }
        } else {
          // --- Tooltip for Multi-line Comparison Chart ---
          tooltipHTML += `<div style="display: flex; flex-direction: column; gap: 4px;">`;
          selectedSymbols.forEach((symbol, index) => {
            const lineSeries = lineSeriesMapRef.current[symbol];
            const lineData = lineSeries ? param.seriesData.get(lineSeries) as LineData | undefined : null;
            const lineColor = TICKER_COLORS[index % TICKER_COLORS.length];

            if (lineData && lineData.value !== undefined) {
              const val = lineData.value;
              const displayVal = comparisonMode === 'percent'
                ? `${val >= 0 ? '+' : ''}${val.toFixed(2)}%`
                : `NT$ ${val.toFixed(1)}`;

              tooltipHTML += `
                <div style="display: flex; justify-content: space-between; gap: 16px; align-items: center;">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <div style="width: 8px; height: 8px; border-radius: 50%; background-color: ${lineColor}"></div>
                    <span style="color: #666; font-weight: 600; font-size: 11px;">${symbol}:</span>
                  </div>
                  <span style="font-weight: bold; color: #1a1a1a; font-size: 11px;">${displayVal}</span>
                </div>
              `;
            }
          });
          tooltipHTML += `</div>`;
        }

        toolTip.innerHTML = tooltipHTML;

        // Position tooltip
        const coordinate = param.point.x;
        let left = coordinate + 20;
        if (left > container.clientWidth - 230) {
          left = coordinate - 230;
        }
        toolTip.style.left = left + 'px';
        toolTip.style.top = '20px';
      }
    };

    chart.subscribeCrosshairMove(handleCrosshairMove);
    chart.timeScale().fitContent();

    return () => {
      chart.unsubscribeCrosshairMove(handleCrosshairMove);
    };
  }, [dataMap, selectedSymbols, comparisonMode, upColor, downColor]);

  const hasSelectedData = selectedSymbols.some(sym => dataMap[sym] && dataMap[sym].length > 0);

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-4 border border-gray-100 min-h-[400px] flex flex-col justify-center relative">
      {!hasSelectedData ? (
        <div className="text-center text-gray-400 py-20">
          <p className="text-lg font-medium">No Data Available</p>
          <p className="text-sm">Try selecting a different stock symbol.</p>
        </div>
      ) : (
        <div ref={chartContainerRef} className="w-full relative" />
      )}
    </div>
  );
};
