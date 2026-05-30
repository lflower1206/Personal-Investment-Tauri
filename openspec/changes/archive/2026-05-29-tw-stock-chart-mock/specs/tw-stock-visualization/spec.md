## ADDED Requirements

### Requirement: TW Style Candlestick Rendering
The system SHALL render stock price data as candlesticks using the Taiwanese color convention: Red for price increases and Green for price decreases.

#### Scenario: Rendering an upward candle
- **WHEN** the close price is higher than the open price
- **THEN** the candle body and wicks SHALL be colored Red (#ef5350)

#### Scenario: Rendering a downward candle
- **WHEN** the close price is lower than the open price
- **THEN** the candle body and wicks SHALL be colored Green (#26a69a)

### Requirement: Interactive Price and Volume Inspection
The system SHALL provide interactive crosshairs and tooltips to allow users to inspect specific data points on the chart.

#### Scenario: Hovering over the chart
- **WHEN** the user moves the mouse over the chart area
- **THEN** crosshairs SHALL appear following the cursor, and a tooltip SHALL display the date, OHLCV values for the corresponding time point

### Requirement: Daily Mock Data Generation
The system SHALL provide a utility to generate realistic synthetic daily stock data for TW stocks and ETFs.

#### Scenario: Generating TSMC (2330) mock data
- **WHEN** the utility is called for symbol "2330"
- **THEN** it SHALL return OHLCV data points with prices around 1000 and tick sizes constrained to 5.0 increments
