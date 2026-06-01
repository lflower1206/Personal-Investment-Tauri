## Context

The current system has a simple single-ticker visualization using lightweight-charts' `CandlestickSeries`. To build a premium comparison dashboard, we must handle multiple data series, align their timescales, color-code them beautifully, and manage the interactive tooltip state cleanly across varying price bands.

## Goals / Non-Goals

**Goals:**
- Enable selection of up to 5 assets using a premium pill-chip layout.
- Limit max selection to 5 chips elegantly by disabling the remaining chips.
- Add an axis representation toggler supporting `% Return` (normalized) and `$ Price` (absolute).
- Automatically transition the chart visual between Candlesticks (1 ticker) and multiple Lines (2-5 tickers).
- Build a custom synchronized tooltip displaying performance metrics for all compared tickers.

**Non-Goals:**
- Real-time stock data fetching from external APIs (rely on `MockDataService`).
- Plotting multi-asset volume series (only plot volume for single ticker mode).

## Decisions

### 1. Chip Grid Selection Component
- **Decision**: Replace the browser-default `<select>` dropdown with a grid of clickable pill-chips representing available stocks.
- **Rationale**: Pill-chips are extremely visual, touch/click-friendly, and provide instant visual feedback on what is compared. They allow color badges that match the line colors on the chart.
- **Alternatives Considered**: Multi-select dropdown. (Rejected due to high interaction friction and poor visual mapping to chart colors).

### 2. Auto-Transitioning Chart Types
- **Decision**: Single-ticker selected → `CandlestickSeries` + `HistogramSeries` (Volume). Multi-ticker selected → Multiple `LineSeries` (Volume hidden).
- **Rationale**: A candlestick chart is ideal for deep technical analysis of a single asset. For multi-asset performance comparison, overlapping candlesticks look cluttered and illegible. Line charts are the gold standard for performance overlay comparison.

### 3. Price Normalization for Percentage Comparisons
- **Decision**: When `% Return` mode is active, the first data point in the selected time series ($P_0$) acts as the base `0.0%`. All subsequent points ($P_t$) are plotted as:
  $$\text{Return}_t = \frac{P_t - P_0}{P_0} \times 100\%$$
- **Rationale**: This normalizes assets across different price tiers (e.g. TSMC at \$1040 vs. Yuanta 50 at \$190), so growth trajectories are immediately comparable.

### 4. Custom Synchronized Tooltip
- **Decision**: Upgrade the standard lightweight-charts crosshair listener to query the exact value of all active series and format a unified glassmorphism panel overlaying the top-left of the chart container.
- **Rationale**: Offers a consolidated view of all active comparison assets on a specific date, keeping comparison highly interactive and simple.

---

## Risks / Trade-offs

- **Risk**: Mismatched dates or gaps in trading calendars across tickers.
  - *Mitigation*: Our `MockDataService` uses a shared calendar logic (generating backwards from today, skipping weekends). To ensure robustness, the `StockChart` will align dates by grouping data points by their ISO string `time` keys.
- **Risk**: React performance bottleneck when swapping series or selecting/deselecting frequently.
  - *Mitigation*: Use React `useMemo` to cache loaded datasets, and write clean, resilient cleanup logic in `StockChart`'s `useEffect` to safely dispose of unused series and event handlers.
