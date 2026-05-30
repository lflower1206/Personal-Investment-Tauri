import { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData, HistogramData, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import { OHLCV } from '../services/MockDataService';

interface StockChartProps {
  data: OHLCV[];
  colors?: {
    upColor?: string;
    downColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
}

export const StockChart = ({
  data,
  colors: {
    upColor = '#ef5350', // TW Red for Up
    downColor = '#26a69a', // TW Green/Teal for Down
    backgroundColor = 'transparent',
    textColor = '#333',
  } = {},
}: StockChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const toolTipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const container = chartContainerRef.current;
    
    // Create tooltip element
    const toolTip = document.createElement('div');
    toolTip.className = 'floating-tooltip';
    Object.assign(toolTip.style, {
      width: '180px',
      height: '160px',
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
      border: '1px solid #f0f0f0',
      borderRadius: '8px',
      background: 'rgba(255, 255, 255, 0.96)',
      color: '#1a1a1a',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      backdropFilter: 'blur(4px)',
      fontFamily: 'monospace',
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

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor,
      downColor,
      borderVisible: false,
      wickUpColor: upColor,
      wickDownColor: downColor,
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: downColor,
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    // Tooltip update logic
    chart.subscribeCrosshairMove((param) => {
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
        const data = param.seriesData.get(candlestickSeries);
        const volumeData = param.seriesData.get(volumeSeries);
        
        if (data && 'open' in data) {
          const dateStr = param.time as string;
          const isUp = (data as any).close >= (data as any).open;
          
          toolTip.innerHTML = `
            <div style="color: #666; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 4px;">${dateStr}</div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span>Open:</span>
              <span style="font-weight: bold">${data.open}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span>High:</span>
              <span style="font-weight: bold; color: ${upColor}">${data.high}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span>Low:</span>
              <span style="font-weight: bold; color: ${downColor}">${data.low}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span>Close:</span>
              <span style="font-weight: bold; color: ${isUp ? upColor : downColor}">${data.close}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 6px; border-top: 1px solid #eee;">
              <span>Volume:</span>
              <span style="font-weight: bold">${(volumeData as any)?.value || 0}</span>
            </div>
          `;
        }

        const coordinate = param.point.x;
        let left = coordinate + 20;
        if (left > container.clientWidth - 200) {
          left = coordinate - 200;
        }
        toolTip.style.left = left + 'px';
        toolTip.style.top = '20px';
      }
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;
    volumeSeriesRef.current = volumeSeries;

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      if (container.contains(toolTip)) {
        container.removeChild(toolTip);
      }
    };
  }, [backgroundColor, textColor, upColor, downColor]);

  useEffect(() => {
    if (candlestickSeriesRef.current && volumeSeriesRef.current) {
      const candlestickData: CandlestickData[] = data.map((d) => ({
        time: d.time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }));

      const volumeData: HistogramData[] = data.map((d) => ({
        time: d.time,
        value: d.volume,
        color: d.close >= d.open ? upColor : downColor,
      }));

      candlestickSeriesRef.current.setData(candlestickData);
      volumeSeriesRef.current.setData(volumeData);
      
      chartRef.current?.timeScale().fitContent();
    }
  }, [data, upColor, downColor]);

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-4 border border-gray-100 min-h-[400px] flex flex-col justify-center">
      {data.length === 0 ? (
        <div className="text-center text-gray-400 py-20">
          <p className="text-lg font-medium">No Data Available</p>
          <p className="text-sm">Try selecting a different stock symbol.</p>
        </div>
      ) : (
        <div ref={chartContainerRef} className="w-full" />
      )}
    </div>
  );
};
