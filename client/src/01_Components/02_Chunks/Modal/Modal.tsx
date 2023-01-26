import { FC } from 'react'
import s from './modal.module.scss'

interface Props {
  isActive: boolean
  setIsActive: (value: boolean) => void
}

export const Modal: FC<Props> = ({ children, isActive, setIsActive }) => {
  return (
    <div onClick={() => setIsActive(false)} className={`${s.container} ${isActive ? s.active : ''}`}>
      <div onClick={(e) => e.stopPropagation()} className={`${s.content} ${isActive ? s.active : ''}`}>
        {children}
      </div>
    </div>
  )
}
