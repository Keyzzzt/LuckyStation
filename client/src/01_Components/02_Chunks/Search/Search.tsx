import { FC, FormEvent, useState } from 'react'
import styles from './Search.module.scss'
import { useHistory } from 'react-router-dom'

export const Search: FC = () => {
  const [keyword, setKeyword] = useState('')
  const history = useHistory()

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (keyword.trim()) {
      history.push(`/${keyword}`)
    } else {
      history.push('/')
    }
  }

  return (
    <form onSubmit={submitHandler}>
      <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Search..." className={styles.input} />
      <input type="submit" value="Search" className={styles.input} />
    </form>
  )
}
