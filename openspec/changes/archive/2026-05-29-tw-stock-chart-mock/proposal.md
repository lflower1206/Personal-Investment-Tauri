## Why

Visualizing stock data is a core requirement for a personal investment application. This change introduces a high-performance interactive chart for Taiwan (TW) stocks and ETFs, starting with a robust mock data implementation to allow front-end development and UX validation before integrating real-time data providers.

## What Changes

- **New Charting Component**: Integration of TradingView's `lightweight-charts` library to provide professional-grade financial visualization.
- **Taiwanese Market Styling**: Custom configuration for the Taiwanese market color convention (Red = Price Up, Green = Price Down).
- **Interactivity**: Implementation of crosshairs and data tooltips for precise price/volume inspection.
- **Mock Data Engine**: A new service to generate realistic daily OHLCV (Open, High, Low, Close, Volume) data for major TW stocks (e.g., TSMC 2330, 0050 ETF), including realistic price limits and tick sizes.

## Capabilities

### New Capabilities
- `tw-stock-visualization`: The ability to render interactive financial charts with specific TW market styling and daily granularity.
- `stock-data-mocking`: A service to generate realistic synthetic stock market data for testing and development.

### Modified Capabilities
(None)

## Impact

- **Dependencies**: Adds `lightweight-charts` as a front-end dependency.
- **UI Architecture**: Introduces a new components and services structure for financial data handling.
- **Development Experience**: Enables front-end development without requiring active API keys or live market connections.
