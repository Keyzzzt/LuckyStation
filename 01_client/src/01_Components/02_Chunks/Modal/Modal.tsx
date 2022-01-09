import { FC } from 'react'
import styles from './Modal.module.scss'

export const Modal: FC<any> = ({ children, isActive, setIsActive }) => {
  return (
    <div onClick={() => setIsActive(false)} className={`${styles.container} ${isActive ? styles.active : ''}`}>
      <div onClick={(e) => e.stopPropagation()} className={`${styles.content} ${isActive ? styles.active : ''}`}>
        {children}
      </div>
    </div>
  )
}
