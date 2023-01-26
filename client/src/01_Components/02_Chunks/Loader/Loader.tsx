import { FC } from 'react'
import s from './loader.module.scss'

const Loader: FC = () => {
  return (
    // there is two loader with class loader_1 and loader_2
    <div className={s.loader_1} />
  )
}

export default Loader
