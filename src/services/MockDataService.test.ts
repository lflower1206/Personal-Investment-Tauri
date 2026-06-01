import { describe, it, expect } from 'vitest';
import { MockDataService } from './MockDataService';

describe('MockDataService', () => {
  it('generates the requested number of days', () => {
    const days = 30;
    const data = MockDataService.getStockData('2330', days);
    expect(data.length).toBe(days);
  });

  it('generates unique dates in ascending order', () => {
    const data = MockDataService.getStockData('2330', 10);
    for (let i = 1; i < data.length; i++) {
      const prevDate = new Date(data[i - 1].time).getTime();
      const currDate = new Date(data[i].time).getTime();
      expect(currDate).toBeGreaterThan(prevDate);
    }
  });

  it('respects the 10% price limit for TW stocks', () => {
    // We'll generate a larger sample to increase chance of seeing significant moves
    const data = MockDataService.getStockData('2330', 100);
    
    for (let i = 1; i < data.length; i++) {
      const prevClose = data[i - 1].close;
      const currClose = data[i].close;
      const percentChange = Math.abs((currClose - prevClose) / prevClose);
      
      // Allow for a tiny floating point margin
      expect(percentChange).toBeLessThanOrEqual(0.100001);
    }
  });

  it('rounds prices to the specified tick size', () => {
    // TSMC (2330) has a tick size of 5.0 in our mock service
    const data = MockDataService.getStockData('2330', 20);
    data.forEach(point => {
      expect(point.open % 5).toBe(0);
      expect(point.high % 5).toBe(0);
      expect(point.low % 5).toBe(0);
      expect(point.close % 5).toBe(0);
    });

    // 0050 has a tick size of 0.05
    const data0050 = MockDataService.getStockData('0050', 20);
    data0050.forEach(point => {
      // Use multiply by 100 and Math.round to avoid floating point issues with modulo
      expect(Math.round(point.open * 100) % 5).toBe(0);
      expect(Math.round(point.close * 100) % 5).toBe(0);
    });

    // 2454 has a tick size of 5.0
    const data2454 = MockDataService.getStockData('2454', 20);
    data2454.forEach(point => {
      expect(point.open % 5).toBe(0);
      expect(point.close % 5).toBe(0);
    });

    // 2308 and 2603 have a tick size of 0.5
    ['2308', '2603'].forEach(sym => {
      const dataSym = MockDataService.getStockData(sym, 20);
      dataSym.forEach(point => {
        expect(Math.round(point.open * 10) % 5).toBe(0);
        expect(Math.round(point.close * 10) % 5).toBe(0);
      });
    });
  });

  it('generates realistic OHLC relationships', () => {
    const data = MockDataService.getStockData('2330', 50);
    data.forEach(point => {
      expect(point.high).toBeGreaterThanOrEqual(point.open);
      expect(point.high).toBeGreaterThanOrEqual(point.close);
      expect(point.low).toBeLessThanOrEqual(point.open);
      expect(point.low).toBeLessThanOrEqual(point.close);
    });
  });
});
