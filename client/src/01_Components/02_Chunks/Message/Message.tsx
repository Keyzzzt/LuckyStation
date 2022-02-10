import { FC } from 'react'
import styles from './Message.module.scss'

type Props = {
  message: string | null
  type: 'fail' | 'success'
}

export const Message: FC<Props> = ({ message, type }) => {
  return <div className={styles.container}>{message}</div>
}
