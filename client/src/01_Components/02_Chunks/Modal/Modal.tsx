import { FC } from 'react'
import styles from './Modal.module.scss'

interface Props {
  isActive: boolean
  setIsActive: (value: boolean) => void
}

export const Modal: FC<Props> = ({ children, isActive, setIsActive }) => {
  return (
    <div onClick={() => setIsActive(false)} className={`${styles.container} ${isActive ? styles.active : ''}`}>
      <div onClick={(e) => e.stopPropagation()} className={`${styles.content} ${isActive ? styles.active : ''}`}>
        {children}
      </div>
    </div>
  )
}
