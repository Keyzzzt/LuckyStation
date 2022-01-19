import { FC } from 'react'
import styles from './VerticalSlider.module.scss'
import { useHistory } from 'react-router-dom'

type Props = {}
export const VerticalSlider: FC<Props> = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.content}>
          <div>
            <img src="" alt="" />
          </div>
          <span className={styles.name}>James Bond</span>
          <p>Frontend Developer</p>
        </div>
      </div>
    </div>
  )
}
