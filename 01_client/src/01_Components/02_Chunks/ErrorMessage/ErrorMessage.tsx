import React from 'react'
import styles from './ErrorMessage.module.scss'

type Props = {
  message: string
}

export const ErrorMessage: React.FC<Props> = ({ message }) => {
  return <div className={styles.container}>{message}</div>
}
