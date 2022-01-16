import { FC, KeyboardEvent, useState } from 'react'
import styles from './AutoResizeTextArea.module.scss'

type Props = {
  placeholder?: string
}
export const AutoResizeTextArea: FC<Props> = ({ placeholder = 'Type text here...' }) => {
  const [value, setValue] = useState('')

  const resize = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    console.log(e.target)

    setValue('auto')

    // @ts-ignore
    const height = e.target.scrollHeight
    setValue(height + 'px')
  }

  return (
    <button className={styles.container}>
      <h2 className={styles.title}>Auto Resize TextArea</h2>
      <textarea onKeyUp={resize} placeholder={placeholder} style={{ height: value }} />
    </button>
  )
}
