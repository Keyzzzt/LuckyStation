import React, { useState, KeyboardEvent, FC, useEffect } from 'react'
import s from './editableSpan.module.scss'
// TODO wrap in React.memo ?
type PropsType = {
  value: string
  changeValue: (title: string) => void
  asTextArea?: boolean
}
export const EditableSpan: FC<PropsType> = ({ value, changeValue, asTextArea }) => {
  console.log('EDITABLE SPAN')
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
  const onEnter = (e: KeyboardEvent<HTMLInputElement> | KeyboardEvent<HTMLTextAreaElement>) => e.key === 'Enter' && offEditMode()
  return (
    isEditMode && !asTextArea
      ? <input
        className='stationTableInput'
        onBlur={offEditMode}
        onChange={(e) => setTitle(e.currentTarget.value)}
        onKeyDown={onEnter}
        value={title}
        autoFocus
      />
      : isEditMode && asTextArea
      ? <textarea
        className={`stationTableInput ${s.textareaField}`}
        onBlur={offEditMode}
        onChange={(e) => setTitle(e.currentTarget.value)}
        onKeyDown={onEnter}
        value={title}
        autoFocus
      />
      : <div onDoubleClick={onEditMode}>{title}</div>
  )
}

