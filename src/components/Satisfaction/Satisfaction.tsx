import { FunctionComponent } from 'react';
import styles from './Satisfaction.module.scss';
import cn from 'classnames';
import type { AqiStatus } from '@/utils/aqi';

interface IProps {
	className?: string;
	status?: AqiStatus;
}

const Satisfaction: FunctionComponent<IProps> = ({ className, status = 'nodata' }) => {
	const classes = cn(
		styles.satisfaction,
		{
			[styles.satisfied]: status === 'good',
			[styles.warning]: status === 'moderate',
			[styles.unsatisfied]: status === 'unhealthy',
			[styles.nodata]: status === 'nodata',
		},
		className,
	);

	let title = 'Нет данных';
	let subtitle = 'Попробуйте обновить позже';
	if (status === 'good') {
		title = 'Душнила доволен вами';
		subtitle = 'AQI в норме';
	} else if (status === 'moderate') {
		title = 'Душнила предупреждает';
		subtitle = 'Показатели повышены';
	} else if (status === 'unhealthy') {
		title = 'Душнила недоволен вами';
		subtitle = 'Есть превышение';
	}

	return (
		<section className={classes} role="status" aria-live="polite">
			<h1 className={styles.satisfaction__head}>{title}</h1>
			<p className={styles.satisfaction__indicators}>{subtitle}</p>
		</section>
	);
};

export default Satisfaction;
