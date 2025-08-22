import { describe, it, expect } from 'vitest';
import { pm25ToAqi, aqiToStatus } from './aqi';

describe('pm25ToAqi', () => {
	it('returns undefined for null/undefined', () => {
		expect(pm25ToAqi(undefined)).toBeUndefined();
		expect(pm25ToAqi(null as unknown as number)).toBeUndefined();
	});

	it('maps PM2.5 in 0-12 to AQI 0-50', () => {
		expect(pm25ToAqi(0)).toBe(0);
		expect(pm25ToAqi(12)).toBe(50);
	});

	it('maps PM2.5 in 12.1-35.4 to AQI 51-100', () => {
		const aqi = pm25ToAqi(25);
		expect(aqi).toBeGreaterThanOrEqual(51);
		expect(aqi).toBeLessThanOrEqual(100);
	});

	it('maps PM2.5 in 35.5-55.4 to AQI 101-150', () => {
		const aqi = pm25ToAqi(40);
		expect(aqi).toBeGreaterThanOrEqual(101);
		expect(aqi).toBeLessThanOrEqual(150);
	});

	it('extrapolates for high PM2.5 values', () => {
		expect(pm25ToAqi(200)).toBeGreaterThan(200);
	});
});

describe('aqiToStatus', () => {
	it('returns nodata for undefined/null', () => {
		expect(aqiToStatus(undefined)).toBe('nodata');
		expect(aqiToStatus(null as unknown as number)).toBe('nodata');
	});

	it('categorizes 0-100 as good', () => {
		expect(aqiToStatus(0)).toBe('good');
		expect(aqiToStatus(100)).toBe('good');
	});

	it('categorizes 101-150 as moderate', () => {
		expect(aqiToStatus(101)).toBe('moderate');
		expect(aqiToStatus(150)).toBe('moderate');
	});

	it('categorizes >150 as unhealthy', () => {
		expect(aqiToStatus(151)).toBe('unhealthy');
		expect(aqiToStatus(250)).toBe('unhealthy');
	});
}); 