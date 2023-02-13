import React, { FC } from 'react'
import s from './button.module.scss'

type Props = {
  title: string
  type: 'submit' | 'button'
  color: 'success' | 'danger'
  marginTop?: string
  onClick?: any
  width?: string | undefined
  padding?: string | undefined

}

export const Button: FC<Props> = ({title, type, color, marginTop = undefined, onClick, width = undefined, padding = undefined}) => {
  const className = color === 'success' ? s.success : s.danger

  return (
    <input onClick={onClick} style={{marginTop, width, padding}} className={className} type={type} value={title}/>
  )
}
