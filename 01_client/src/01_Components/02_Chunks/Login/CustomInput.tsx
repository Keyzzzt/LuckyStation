/* eslint-disable no-useless-escape */
import { FC } from 'react'
import styles from './Auth.module.scss'

type Props = {
  showError: boolean | string
  blurHandler: (e: any) => void
  onChangeHandler: (e: any) => void
  value: string
  error: string
  type: string
  placeholder: string
  name: string
}

export const CustomInput: FC<Props> = ({ showError, blurHandler, onChangeHandler, value, error, type, placeholder, name }) => {
  return (
    <div className={`${styles.field} ${styles.password} ${showError ? styles.shake : ''}`}>
      <div className={styles.inputArea}>
        <input onBlur={blurHandler} className={showError ? styles.borderError : ''} onChange={onChangeHandler} type={type} placeholder={placeholder} value={value} name={name} />
        <i className={`${styles.icon} fas fa-${name === 'email' ? 'envelope' : 'lock'}`} />
        {showError && <i className={`${styles.errorIcon} fas fa-exclamation-circle`}></i>}
      </div>
      {showError && <div className={styles.errorText}>{error}</div>}
    </div>
  )
}
