import { FC } from 'react'
import styles from './loader.module.scss'

const Loader: FC = () => {
  return (
    // there is two loader with class loader_1 and loader_2
    <div className={styles.loader_1}></div>
  )
}

export default Loader
