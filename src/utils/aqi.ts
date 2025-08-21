export type AqiStatus = 'good' | 'moderate' | 'unhealthy' | 'nodata';

export function pm25ToAqi(pm25: number | undefined | null): number | undefined {
	if (pm25 == null || Number.isNaN(pm25)) return undefined;
	const c = Number(pm25);
	// US EPA breakpoints (упрощённо для первых трёх диапазонов)
	const ranges = [
		{ cLow: 0.0, cHigh: 12.0, aqiLow: 0, aqiHigh: 50 },
		{ cLow: 12.1, cHigh: 35.4, aqiLow: 51, aqiHigh: 100 },
		{ cLow: 35.5, cHigh: 55.4, aqiLow: 101, aqiHigh: 150 },
		{ cLow: 55.5, cHigh: 150.4, aqiLow: 151, aqiHigh: 200 },
	];
	for (const { cLow, cHigh, aqiLow, aqiHigh } of ranges) {
		if (c >= cLow && c <= cHigh) {
			return Math.round(((aqiHigh - aqiLow) / (cHigh - cLow)) * (c - cLow) + aqiLow);
		}
	}
	// Для значений вне диапазона — простая экстраполяция
	if (c > 150.4) {
		const cLow = 150.5, cHigh = 250.4, aqiLow = 201, aqiHigh = 300;
		return Math.round(((aqiHigh - aqiLow) / (cHigh - cLow)) * (c - cLow) + aqiLow);
	}
	return undefined;
}

export function aqiToStatus(aqi: number | undefined | null): AqiStatus {
	if (aqi == null || Number.isNaN(aqi)) return 'nodata';
	if (aqi <= 100) return 'good';
	if (aqi <= 150) return 'moderate';
	return 'unhealthy';
} 