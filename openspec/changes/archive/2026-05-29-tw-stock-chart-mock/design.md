## Context

The personal investment application currently lacks data visualization capabilities. To provide immediate value and enable UX exploration, we need a high-quality charting solution that works with mock data before live integration. The Taiwan market has specific visual conventions that must be supported.

## Goals / Non-Goals

**Goals:**
- Integrate `lightweight-charts` into the React/Vite project.
- Create a reusable `StockChart` React component.
- Implement a `MockDataService` to simulate TW stock data.
- Support Taiwanese color conventions (Red=Up, Green=Down).
- Ensure interactive features like crosshairs are enabled and customized.

**Non-Goals:**
- Integration with live market data APIs (TWS, FinMind, etc.) at this stage.
- Technical analysis indicators (MACD, RSI) implementation.
- Persistent storage for mock data.

## Decisions

### 1. Charting Library: `lightweight-charts`
**Rationale**: It is developed by TradingView, highly optimized for performance (Canvas-based), and specifically designed for financial time-series data. It is significantly lighter than `Chart.js` or `ECharts` for this specific use case.
**Alternatives**: 
- `d3.js`: High flexibility but extremely high development cost for standard financial charts.
- `ApexCharts`: Easier to use but performance degrades with large datasets.

### 2. Component Architecture: Separate Service and Component
**Rationale**: By separating the `MockDataService` from the `StockChart` component, we can easily swap the mock service for a real `MarketDataService` in the future without modifying the UI layer.

### 3. State Management: React `useEffect` and Refs
**Rationale**: `lightweight-charts` manages its own internal DOM and state via a Canvas. We will use a `ref` to the container and manage the lifecycle (creation, data updates, destruction) within a `useEffect` hook.

## Risks / Trade-offs

- **[Risk] Library Conflict** → `lightweight-charts` requires a stable DOM node. We must ensure the `useEffect` cleanup function properly calls `.remove()` to prevent memory leaks or duplicate charts during React HMR.
- **[Risk] Mock Realism** → Mock data might not cover all edge cases (e.g., dividends, splits). We will limit scope to simple OHLCV for now.
