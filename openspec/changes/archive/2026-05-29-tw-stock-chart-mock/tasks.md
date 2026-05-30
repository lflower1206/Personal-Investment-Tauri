## 1. Project Setup

- [x] 1.1 Install `lightweight-charts` dependency via pnpm.
- [x] 1.2 Create directory structure: `src/components`, `src/services`, `src/hooks`.

## 2. Mock Data Engine

- [x] 2.1 Implement `MockDataService.ts` with basic random walk logic.
- [x] 2.2 Add market-specific constraints (tick sizes, 10% price limits).
- [x] 2.3 Implement TSMC (2330) and 0050 ETF specific data presets.

## 3. Chart Component Implementation

- [x] 3.1 Create `StockChart.tsx` component using `lightweight-charts`.
- [x] 3.2 Configure Taiwanese color convention (Red = Up, Green = Down).
- [x] 3.3 Implement crosshair and tooltip interaction.
- [x] 3.4 Integrate volume series as a sub-pane or overlay.

## 4. Dashboard Integration

- [x] 4.1 Update `App.tsx` to include the new `StockChart`.
- [x] 4.2 Add a simple selector to toggle between different mock stocks.
- [x] 4.3 Verify chart responsiveness and interactivity.
