import { FunctionComponent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Days, Logo, Satisfaction, Temperature } from '@/components';
import styles from './Landing.module.scss';
import { fetchAirData } from '@/services/air';
import { aqiToStatus, pm25ToAqi, type AqiStatus } from '@/utils/aqi';
import { Button } from '@/components/UI';

const Landing: FunctionComponent = () => {
	const token = import.meta.env.VITE_WAQI_TOKEN as string | undefined;
	const station = (import.meta.env.VITE_WAQI_STATION as string | undefined) ?? 'A472336';

	const { isLoading, isError, data, refetch, isFetching } = useQuery({
		queryKey: ['air'],
		queryFn: () => fetchAirData(token, station),
		refetchInterval: 60000,
	});

	const aqi = data?.aqi ?? pm25ToAqi(data?.pm25 ?? undefined);
	const status: AqiStatus = aqiToStatus(aqi);

	if (isLoading) {
		return (
			<main className={styles.landing}>
				<h1 className={styles.landing__title}>Д У Ш Н И Л А</h1>
				<div className={styles.landing__container}>
					<section className={styles.landing__1}>
						<div>Загрузка…</div>
					</section>
				</div>
			</main>
		);
	}

	if (isError) {
		return (
			<main className={styles.landing}>
				<h1 className={styles.landing__title}>Д У Ш Н И Л А</h1>
				<div className={styles.landing__container}>
					<section className={styles.landing__1}>
						<div>Ошибка загрузки. Попробуйте ещё раз.</div>
						<Button onClick={() => refetch()}>Повторить</Button>
					</section>
				</div>
			</main>
		);
	}

	return (
		<>
			<main className={styles.landing}>
				<h1 className={styles.landing__title}>Д У Ш Н И Л А</h1>
				<div className={styles.landing__container}>
					<Satisfaction className={styles.landing__1} status={status} />
					<Days className={styles.landing__2} />
					<Logo className={styles.landing__3} />
					<Temperature
						className={styles.landing__4}
						status={status}
						data={{
							aqi: aqi,
							pm25: data?.pm25,
							pm10: data?.pm10,
							temperature: data?.temperature,
							humidity: data?.humidity,
							updatedAt: data?.updatedAt,
							source: data?.source ?? 'sample',
						}}
						onRefresh={() => refetch()}
						isRefreshing={isFetching}
					/>
				</div>
			</main>
		</>
	);
};

export default Landing;
