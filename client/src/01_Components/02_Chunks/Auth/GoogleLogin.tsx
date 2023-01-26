import { FC } from 'react'
import s from './auth.module.scss'

export const GoogleLogin: FC = () => {
  return (
    <div className={s.google}>
      <a href="http://localhost:5000/api/auth/google/redirect">Login with Google</a>
    </div>
  )
}
