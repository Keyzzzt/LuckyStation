import { FC } from 'react'
import styles from './BackButton.module.scss'
import { useHistory } from 'react-router-dom'

type Props = {
  path: string
}
export const RedirectButton: FC<Props> = ({ children, path }) => {
  const history = useHistory()

  const returnHandler = () => {
    history.push(path)
  }
  return (
    <button className={styles.backButton} onClick={returnHandler}>
      {children}
    </button>
  )
}
