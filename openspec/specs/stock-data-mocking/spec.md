# Stock Data Mocking

## Purpose
The Stock Data Mocking capability provides a service to generate realistic synthetic stock market data for testing and development purposes.

## Requirements

### Requirement: Synthetic OHLCV Generation
The system SHALL be able to generate synthetic time-series data that follows basic financial market principles (random walk with drift).

#### Scenario: Requesting a date range
- **WHEN** requested for 30 days of data
- **THEN** the utility SHALL return exactly 30 unique data points sorted by date

### Requirement: Market-Specific Constraints
The mock data engine SHALL support market-specific constraints such as price limits and tick sizes.

#### Scenario: Applying Taiwan price limits
- **WHEN** generating the next day's price
- **THEN** the new price SHALL NOT exceed +/- 10% of the previous day's close price
