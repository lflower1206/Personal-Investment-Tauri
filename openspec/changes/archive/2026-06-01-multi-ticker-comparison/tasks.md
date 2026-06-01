## 1. Mock Data Service Updates

- [x] 1.1 Expand the stock catalog in `src/App.tsx` (add 2454, 2308, 2603)
- [x] 1.2 Update `MockDataService.ts` to support synthetic data generation for 2454 (MediaTek), 2308 (Delta), and 2603 (Evergreen) with realistic price limits and tick sizes
- [x] 1.3 Add a unit test or verify the generated mock data arrays for new symbols are correctly populated and sorted

## 2. Selection UI & State Management

- [x] 2.1 Refactor selection state in `src/App.tsx` from single `selectedSymbol` string to `selectedSymbols` array
- [x] 2.2 Add comparison mode state (`comparisonMode`) supporting `'percent' | 'absolute'`
- [x] 2.3 Implement the visual Pill-chip grid selection layout, ensuring color indicators match chart lines, and disabled states are activated once selection reaches the limit of 5
- [x] 2.4 Add the interactive toggle bar in `App` header for switching between `% Return` and `$ Price`

## 3. Chart Component Implementation

- [x] 3.1 Refactor `src/components/StockChart.tsx` series initialization logic to dynamically choose between `CandlestickSeries` + `HistogramSeries` (single selection) and multiple `LineSeries` (multi-selection)
- [x] 3.2 Implement the percentage normalization calculation in `StockChart` when `% Return` comparison mode is active
- [x] 3.3 Re-engineer the `subscribeCrosshairMove` tooltip callback to construct a synchronized table overlay displaying values for all active comparison lines side-by-side

## 4. Verification & Clean-up

- [x] 4.1 Run full project compilation and lint commands (`npm run check`) to verify TS safety and styling compliance
- [x] 4.2 Validate single-ticker candlestick visualization and dual-mode comparison chart rendering interactively in the browser
