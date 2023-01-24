import s from './main.module.scss'
import { FC} from 'react'
import * as React from 'react'


export const Main: FC = () => {

  return (
    <div className={s.container}>
        Mini components with basics data and statistic:
        <div>Total users</div>
        <div>Total orders</div>
        <div>...</div>

    </div>
  )
}
