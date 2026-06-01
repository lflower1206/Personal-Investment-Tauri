## ADDED Requirements

### Requirement: Multi-Ticker Selection and Limitation
The system SHALL allow users to select and compare up to 5 tickers simultaneously using interactive color-coded pill chips.

#### Scenario: Selecting more than 5 tickers
- **WHEN** the user has already selected 5 tickers
- **THEN** all other stock selection chips SHALL be disabled, preventing further selection

### Requirement: Dynamic Chart View Transition
The system SHALL dynamically transition the chart rendering based on the number of selected tickers.

#### Scenario: Exactly one ticker selected
- **WHEN** exactly 1 ticker is selected
- **THEN** the system SHALL render a Candlestick + Volume chart in absolute TWD prices with Taiwanese color convention

#### Scenario: Multiple tickers selected
- **WHEN** between 2 and 5 tickers are selected
- **THEN** the system SHALL render a multi-series Line Chart with high-contrast color-coded lines and hide the volume overlay

### Requirement: Comparison Mode Axis Representation
The system SHALL support toggling the vertical axis between absolute currency ($) and normalized percent change (%) when multiple tickers are compared.

#### Scenario: Percent Change mode enabled
- **WHEN** comparison mode is set to % Return
- **THEN** all compared series SHALL begin at exactly 0% on the earliest date in the loaded dataset, and plot their relative percentage performance

#### Scenario: Absolute Price mode enabled
- **WHEN** comparison mode is set to Absolute Price
- **THEN** the chart SHALL plot the absolute TWD closing prices on a single vertical axis

## MODIFIED Requirements

### Requirement: Interactive Price and Volume Inspection
The system SHALL provide interactive crosshairs and tooltips to allow users to inspect specific data points on the chart for all active compared tickers.

#### Scenario: Hovering over a single ticker chart
- **WHEN** exactly 1 ticker is selected and the user moves the mouse over the chart area
- **THEN** crosshairs SHALL appear, and a tooltip SHALL display the date, OHLCV values, and volume for that time point

#### Scenario: Hovering over a multi-ticker comparison chart
- **WHEN** multiple tickers are selected and the user moves the mouse over the chart area
- **THEN** crosshairs SHALL appear, and a synchronized tooltip SHALL display the date and the absolute values or percent changes for all selected tickers side-by-side
