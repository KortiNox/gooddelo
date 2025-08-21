import axios from 'axios';

export type AirData = {
	aqi?: number;
	pm25?: number;
	pm10?: number;
	temperature?: number;
	humidity?: number;
	updatedAt?: string; // ISO
	source: 'waqi' | 'sensor' | 'sample';
};

const SAMARA = { lat: 53.1959, lon: 50.1 };

export async function fetchFromWAQI(token: string | undefined, station: string = 'A472336'): Promise<AirData | undefined> {
	if (!token) return undefined;
	try {
		const url = `https://api.waqi.info/feed/${station}/?token=${token}`;
		const resp = await axios.get(url);
		if (!resp?.data || resp.data.status !== 'ok') return undefined;
		const d = resp.data.data;
		const aqi: number | undefined = typeof d?.aqi === 'number' ? d.aqi : undefined;
		const iaqi = d?.iaqi ?? {};
		const pm25 = typeof iaqi?.pm25?.v === 'number' ? iaqi.pm25.v : undefined;
		const pm10 = typeof iaqi?.pm10?.v === 'number' ? iaqi.pm10.v : undefined;
		const temperature = typeof iaqi?.t?.v === 'number' ? iaqi.t.v : undefined;
		const humidity = typeof iaqi?.h?.v === 'number' ? iaqi.h.v : undefined;
		const updatedAt: string | undefined = typeof d?.time?.s === 'string' ? new Date(d.time.s).toISOString() : new Date().toISOString();
		return { aqi, pm25, pm10, temperature, humidity, updatedAt, source: 'waqi' };
	} catch {
		return undefined;
	}
}

export async function fetchFromSensorCommunity(): Promise<AirData | undefined> {
	try {
		const url = 'https://data.sensor.community/static/v1/data.json';
		const { data } = await axios.get(url, { timeout: 15000 });
		if (!Array.isArray(data)) return undefined;

		const distance = (lat: number, lon: number) => {
			const dLat = lat - SAMARA.lat;
			const dLon = lon - SAMARA.lon;
			return dLat * dLat + dLon * dLon;
		};

		function pickNearestByType(valueType: string): { value?: number; updatedAt?: string } {
			let best: any = null;
			let bestD = Number.POSITIVE_INFINITY;
			for (const entry of data) {
				const loc = entry?.location;
				const lat = Number(loc?.latitude);
				const lon = Number(loc?.longitude);
				if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
				const vals = Array.isArray(entry?.sensordatavalues) ? entry.sensordatavalues : [];
				for (const v of vals) {
					if (v?.value_type !== valueType) continue;
					const d = distance(lat, lon);
					if (d < bestD) {
						bestD = d;
						best = { value: parseFloat(v?.value), updatedAt: entry?.timestamp || entry?.created_at || entry?.date || undefined };
					}
				}
			}
			return { value: Number.isFinite(best?.value) ? Number(best.value) : undefined, updatedAt: best?.updatedAt ? new Date(best.updatedAt).toISOString() : undefined };
		}

		const pm25Pick = pickNearestByType('P2');
		const pm10Pick = pickNearestByType('P1');
		const tempPick = pickNearestByType('temperature');
		const humPick = pickNearestByType('humidity');

		const updatedAt = pm25Pick.updatedAt || tempPick.updatedAt || pm10Pick.updatedAt || humPick.updatedAt || new Date().toISOString();

		return {
			pm25: pm25Pick.value,
			pm10: pm10Pick.value,
			temperature: tempPick.value,
			humidity: humPick.value,
			updatedAt,
			source: 'sensor',
		};
	} catch {
		return undefined;
	}
}

export async function fetchFromSample(): Promise<AirData | undefined> {
	try {
		const { data } = await axios.get('/sample.json', { timeout: 5000 });
		if (!data || typeof data !== 'object') return undefined;
		return { ...data, source: 'sample' } as AirData;
	} catch {
		return undefined;
	}
}

export async function fetchAirData(token?: string, station?: string): Promise<AirData> {
	const waqi = await fetchFromWAQI(token, station);
	if (waqi?.aqi != null || waqi?.pm25 != null || waqi?.temperature != null) return waqi!;
	const sensor = await fetchFromSensorCommunity();
	if (sensor) return sensor;
	const sample = await fetchFromSample();
	if (sample) return sample;
	return { source: 'sample' };
} 