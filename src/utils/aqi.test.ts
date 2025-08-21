import { describe, it, expect } from 'vitest';
import { aqiToStatus, pm25ToAqi } from './aqi';

describe('pm25ToAqi', () => {
	it('maps 10 µg/m³ to AQI within 0-50', () => {
		const aqi = pm25ToAqi(10);
		expect(aqi).toBeDefined();
		expect(aqi!).toBeGreaterThanOrEqual(0);
		expect(aqi!).toBeLessThanOrEqual(50);
	});
	it('maps 30 µg/m³ to AQI within 51-100', () => {
		const aqi = pm25ToAqi(30);
		expect(aqi).toBeDefined();
		expect(aqi!).toBeGreaterThanOrEqual(51);
		expect(aqi!).toBeLessThanOrEqual(100);
	});
	it('maps 40 µg/m³ to AQI within 101-150', () => {
		const aqi = pm25ToAqi(40);
		expect(aqi).toBeDefined();
		expect(aqi!).toBeGreaterThanOrEqual(101);
		expect(aqi!).toBeLessThanOrEqual(150);
	});
});

describe('aqiToStatus', () => {
	it('returns good for <= 100', () => {
		expect(aqiToStatus(0)).toBe('good');
		expect(aqiToStatus(100)).toBe('good');
	});
	it('returns moderate for 101-150', () => {
		expect(aqiToStatus(120)).toBe('moderate');
	});
	it('returns unhealthy for > 150', () => {
		expect(aqiToStatus(151)).toBe('unhealthy');
	});
	it('returns nodata for undefined/null', () => {
		expect(aqiToStatus(undefined)).toBe('nodata');
		expect(aqiToStatus(null)).toBe('nodata');
	});
}); 