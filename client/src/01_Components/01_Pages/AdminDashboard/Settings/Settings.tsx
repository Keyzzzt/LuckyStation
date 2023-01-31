import s from './settings.module.scss'
import { FC } from 'react'
import { BreadCrumbs } from '../../../02_Chunks/Breadcrumbs/Breadcrumbs'


type Props = {
}

export const Settings: FC<Props> = () => {

  return (
    <div className={s.container}>
      <BreadCrumbs pageTitle='Settings' breadcrumbs={['dashboard', 'settings']}/>

    </div>
  )
}
