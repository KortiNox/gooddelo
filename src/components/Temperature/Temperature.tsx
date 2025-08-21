import { FunctionComponent } from 'react';
import cn from 'classnames';
import styles from './Temperature.module.scss';
import type { AirData } from '@/services/air';
import type { AqiStatus } from '@/utils/aqi';
import { Button } from '@/components/UI';

interface IProps {
	className?: string;
	status?: AqiStatus;
	data: AirData;
	onRefresh?: () => void;
	isRefreshing?: boolean;
}

function formatUpdatedAt(iso?: string): string | undefined {
	if (!iso) return undefined;
	const diffMs = Date.now() - new Date(iso).getTime();
	const mins = Math.max(0, Math.floor(diffMs / 60000));
	if (mins === 0) return 'обновлено только что';
	return `обновлено ${mins} мин назад`;
}

const Temperature: FunctionComponent<IProps> = ({ className, status = 'nodata', data, onRefresh, isRefreshing }) => {
	const secondaryValue = (() => {
		if (data.pm25 != null) return { label: 'PM2.5', value: `${Number(data.pm25).toFixed(1)} µg/m³` };
		if (data.temperature != null) return { label: 'Температура', value: `${Number(data.temperature).toFixed(1)} ℃` };
		if (data.pm10 != null) return { label: 'PM10', value: `${Number(data.pm10).toFixed(1)} µg/m³` };
		if (data.humidity != null) return { label: 'Влажность', value: `${Math.round(Number(data.humidity))} %` };
		return undefined;
	})();

	const hasAnyMetric =
		data.temperature != null || data.pm25 != null || data.pm10 != null || data.humidity != null;

	return (
		<section
			className={cn(
				styles.temperature,
				{
					[styles.satisfied]: status === 'good',
					[styles.warning]: status === 'moderate',
					[styles.unsatisfied]: status === 'unhealthy',
				},
				className,
			)}
		>
			{hasAnyMetric ? (
				<>
					{data.temperature != null && (
						<div className={styles.temperature__indicator}>
							<h2>{Number(data.temperature).toFixed(1)} ℃</h2>
							<h4>Температура</h4>
						</div>
					)}

					{secondaryValue && (
						<div className={cn(styles.temperature__indicator, styles.noMobile)}>
							<h2>{secondaryValue.value}</h2>
							<h4>
								{secondaryValue.label}
								{data.updatedAt ? ` · ${formatUpdatedAt(data.updatedAt)}` : ''}
							</h4>
						</div>
					)}
				</>
			) : (
				<div className={styles.temperature__indicator}>
					<h4>Нет данных</h4>
				</div>
			)}

			<div className={styles.actions}>
				<Button onClick={onRefresh} disabled={isRefreshing}>
					{isRefreshing ? 'Обновление…' : 'Обновить'}
				</Button>
			</div>
		</section>
	);
};

export default Temperature;
