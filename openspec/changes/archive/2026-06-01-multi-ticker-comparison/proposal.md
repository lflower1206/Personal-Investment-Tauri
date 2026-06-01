## Why

Currently, the application only supports viewing a single Taiwanese stock or ETF at a time using a Candlestick + Volume Chart. To enable users to perform proper asset allocation and comparison (e.g. evaluating relative growth, comparing an individual stock like TSMC against the Yuanta 50 ETF), the application needs the capability to select and compare up to 5 tickers on the same chart.

## What Changes

- Expand the asset selection interface from a single dropdown to a modern, dynamic chip-based multi-select component (limit to max 5 selections).
- Support dynamic chart view transitions:
  - When **1** ticker is selected: render the standard Candlestick + Volume chart.
  - When **2 to 5** tickers are selected: transition to a multi-series Line Chart with color-coded lines.
- Introduce a dual-axis toggler:
  - **Percent Change (%)**: Normalize closing prices to show comparative performance from the start of the visible range.
  - **Absolute Price ($)**: Plot raw prices directly.
- Upgrade the interactive tooltip to display data points for all active compared tickers side-by-side on hover.
- Expand the synthetic dataset catalog in `MockDataService` to include more well-known Taiwanese stocks (MediaTek 2454, Delta 2308, Evergreen 2603) for meaningful comparison.

## Capabilities

### New Capabilities

*(None)*

### Modified Capabilities

- `tw-stock-visualization`: Update visual rendering requirements to support dual chart types (Candlestick vs. Multi-Line comparison chart), dual representation modes (Percentage vs. Absolute), and synchronized multi-ticker tooltips.

## Impact

- `src/App.tsx`: State changes from single `selectedSymbol` (string) to `selectedSymbols` (string[]), additional selection grid, mode toggle, and expanded stock selection catalog.
- `src/components/StockChart.tsx`: Transition lightweight-charts instantiation to dynamically handle both single Candlestick+Volume and multiple LineSeries, custom color palette mapping, normalization calculations, and upgraded multi-ticker synchronized tooltip.
- `src/services/MockDataService.ts`: Added realistic mock data profiles for 2454, 2308, and 2603.
