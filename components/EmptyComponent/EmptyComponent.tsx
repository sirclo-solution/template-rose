import { FC } from 'react'
import styles from 'public/scss/components/EmptyComponent.module.scss'

type EmptyComponentPropsType = {
	icon?: any
	title?: string
	button?: React.ReactNode
}

const EmptyComponent: FC<EmptyComponentPropsType> = ({ icon, title, button }) => {
	return (
		<div className={styles.emptyContainer}>
			{icon && icon}
			{title && <p className={styles.emptyDesc}>{title}</p>}
			{button && button}
		</div>
	)
}

export default EmptyComponent
