import { FC, useState } from 'react'
import styles from './AutoResizeTextArea.module.scss'

// FIXME:
// FIXME:
// FIXME:
// FIXME:
// FIXME:
// FIXME:
// FIXME:

type Props = {
  placeholder?: string
}
export const AutoResizeTextArea: FC<Props> = ({ placeholder = 'Type text here...' }) => {
  const [value, setValue] = useState('')

  const resize = (e: any) => {
    console.log(e.target)

    setValue('auto')

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
