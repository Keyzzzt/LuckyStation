import React, { useState, KeyboardEvent, FC, useEffect } from 'react'
import s from './editableSpan.module.scss'

type PropsType = {
  value: string
  changeValue: (title: string) => void
}
export const EditableSpan: FC<PropsType> = ({ value, changeValue }) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')

  const onEditMode = () => {
    setIsEditMode(true)
  }
  const offEditMode = () => {
    changeValue(title)
    setIsEditMode(false)
  }
  useEffect(() => {
    setTitle(value)
  }, [value])
  const onEnter = (e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && offEditMode()
  return (
    isEditMode
      ? <input
        onBlur={offEditMode}
        onChange={(e) => setTitle(e.currentTarget.value)}
        onKeyDown={onEnter}
        value={title}
        autoFocus
      />
      : <div onDoubleClick={onEditMode}>{title}</div>
  )
}

