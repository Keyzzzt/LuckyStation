import { FC } from 'react'
import styles from './ErrorMessage.module.scss'

type Props = {
  message: string | null
}

export const ErrorMessage: FC<Props> = ({ message }) => {
  return <div className={styles.container}>{message}</div>
}
