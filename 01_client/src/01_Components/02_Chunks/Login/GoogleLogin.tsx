/* eslint-disable no-useless-escape */
import { FC } from 'react'
import styles from './Auth.module.scss'

export const GoogleLogin: FC = () => {
  return (
    <div className={styles.google}>
      <a href="http://localhost:5000/api/auth/google/redirect">Login with Google</a>
    </div>
  )
}
