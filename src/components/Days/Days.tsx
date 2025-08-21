import { FunctionComponent } from 'react';
import { Button } from '@/components/UI';
import styles from './Days.module.scss';
import cn from 'classnames';

interface IProps {
	className?: string;
}

const Days: FunctionComponent<IProps> = ({ className }) => {
	return (
		<section className={cn(styles.days, className)}>
			<p className={styles.days__count}>
				Дней без душноты {Math.round(Math.random() * 10)}
			</p>
			<Button className={styles.days__button} variant="primary">
				История
			</Button>
		</section>
	);
};

export default Days;
