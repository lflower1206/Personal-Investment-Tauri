export interface OHLCV {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketConstraints {
  tickSize: number;
  priceLimitPercent: number; // e.g. 0.10 for 10%
}

export class MockDataService {
  /**
   * Helper to round a price to the nearest tick size.
   */
  private static roundToTick(price: number, tickSize: number): number {
    return Math.round(price / tickSize) * tickSize;
  }

  /**
   * Generates a random walk time series for stock data with TWSE-like constraints.
   */
  static generateTWMockData(
    days: number = 100,
    startPrice: number = 500,
    volatility: number = 0.02,
    constraints: MarketConstraints = { tickSize: 0.5, priceLimitPercent: 0.10 }
  ): OHLCV[] {
    const data: OHLCV[] = [];
    let currentPrice = startPrice;
    const now = new Date();
    let daysGenerated = 0;
    let daysOffset = 0;

    // Adjust startPrice to tick
    currentPrice = this.roundToTick(currentPrice, constraints.tickSize);

    while (daysGenerated < days) {
      const date = new Date(now);
      // Generate backwards from today
      date.setDate(date.getDate() - daysOffset);
      daysOffset++;
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      const timeStr = date.toISOString().split('T')[0];

      const prevClose = currentPrice;
      
      // Apply random change within volatility
      let change = prevClose * volatility * (Math.random() - 0.5);
      
      // Apply 10% price limit constraint
      const maxChange = prevClose * constraints.priceLimitPercent;
      change = Math.max(-maxChange, Math.min(maxChange, change));

      const open = this.roundToTick(prevClose + (change * 0.2), constraints.tickSize);
      const close = this.roundToTick(prevClose + change, constraints.tickSize);
      
      // High/Low within the price limit and relative to open/close
      const dayMax = prevClose * (1 + constraints.priceLimitPercent);
      const dayMin = prevClose * (1 - constraints.priceLimitPercent);
      
      const high = this.roundToTick(
        Math.min(dayMax, Math.max(open, close) + Math.random() * (prevClose * 0.02)),
        constraints.tickSize
      );
      const low = this.roundToTick(
        Math.max(dayMin, Math.min(open, close) - Math.random() * (prevClose * 0.02)),
        constraints.tickSize
      );
      
      const volume = Math.floor(Math.random() * 1000000) + 100000;

      data.push({
        time: timeStr,
        open,
        high,
        low,
        close,
        volume,
      });

      currentPrice = close;
      daysGenerated++;
    }

    // Sort by date ascending
    return data.sort((a, b) => a.time.localeCompare(b.time));
  }

  static getStockData(symbol: string, days: number = 60): OHLCV[] {
    switch (symbol) {
      case '2330': // TSMC
        return this.generateTWMockData(days, 1040, 0.03, { tickSize: 5.0, priceLimitPercent: 0.10 });
      case '0050': // Yuanta/P-shares Taiwan Top 50 ETF
        return this.generateTWMockData(days, 190, 0.015, { tickSize: 0.05, priceLimitPercent: 0.10 });
      case '2317': // Foxconn
        return this.generateTWMockData(days, 210, 0.025, { tickSize: 0.5, priceLimitPercent: 0.10 });
      case '2454': // MediaTek
        return this.generateTWMockData(days, 1350, 0.03, { tickSize: 5.0, priceLimitPercent: 0.10 });
      case '2308': // Delta Electronics
        return this.generateTWMockData(days, 380, 0.02, { tickSize: 0.5, priceLimitPercent: 0.10 });
      case '2603': // Evergreen Marine
        return this.generateTWMockData(days, 195, 0.035, { tickSize: 0.5, priceLimitPercent: 0.10 });
      default:
        return this.generateTWMockData(days, 100, 0.04, { tickSize: 0.1, priceLimitPercent: 0.10 });
    }
  }
}
