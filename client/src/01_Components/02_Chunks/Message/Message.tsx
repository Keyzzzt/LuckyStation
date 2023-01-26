import { FC } from 'react'
import s from './message.module.scss'

type Props = {
  message: string | null
  type: 'fail' | 'success'
}

export const Message: FC<Props> = ({ message, type }) => {
  return <div className={s.container}>{message}</div>
}
