import React, { FC } from 'react'
import s from './button.module.scss'

type Props = {
  title: string
  type: 'submit' | 'button'
  color: 'success' | 'danger'
  marginTop?: string
  marginRight?: string
  onClick?: any
  minWidth?: string | undefined
  padding?: string | undefined

}

export const Button: FC<Props> = ({title, type, color, marginTop = undefined, onClick, minWidth = undefined, padding = undefined, marginRight = undefined}) => {
  const className = color === 'success' ? s.success : s.danger

  return (
    <input onClick={onClick} style={{marginTop, marginRight, minWidth, padding}} className={className} type={type} value={title}/>
  )
}
