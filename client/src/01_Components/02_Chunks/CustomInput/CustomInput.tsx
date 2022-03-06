/* eslint-disable no-useless-escape */
import styles from './CustomInput.module.scss'
import { FC, ChangeEvent, useState, useEffect } from 'react'
import { isEmail } from '../../../04_Utils/utils'

type Props = {
  type: string
  placeholder: string
  name: string
  inputError: boolean
  value: string
  returnValue(value: string): void
  setInputError(value: boolean): void
}

export const CustomInput: FC<Props> = ({ type, placeholder, name, inputError, returnValue, setInputError, value }) => {
  let iconValue = ''
  switch (name) {
    case 'email':
      iconValue = 'fas fa-envelope'
      break
    case 'password':
      iconValue = 'fas fa-lock'
      break
    case 'name':
    case 'lastName':
      iconValue = 'fa-solid fa-user'
      break
    case 'country':
      iconValue = 'fa-solid fa-globe'
      break
    default:
      iconValue = ''
  }

  const [errorMessage, setErrorMessage] = useState('Empty field')
  const [isDirty, setIsDirty] = useState(false)
  const showError = errorMessage && isDirty

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInputError(false)
    returnValue(e.target.value)
  }

  useEffect(() => {
    if (inputError) {
      setIsDirty(true)
    }
  }, [inputError])

  useEffect(() => {
    switch (name) {
      case 'email':
        if (isEmail(value)) {
          setErrorMessage('')
          break
        } else {
          setErrorMessage('Enter a valid email')
          break
        }
      case 'password':
        if (value.length >= 6) {
          setErrorMessage('')
          break
        } else {
          setErrorMessage('Enter a valid password')
          break
        }
      case 'apartment':
        setErrorMessage('')
        break

      default:
        if (value.length > 1) {
          setErrorMessage('')
          break
        } else {
          setErrorMessage('Field is required')
          break
        }
    }
  }, [value])

  return (
    <div className={`${styles.field} ${showError ? styles.shake : ''}`}>
      <div className={styles.inputArea}>
        <input
          onBlur={() => setIsDirty(true)}
          className={`${showError ? styles.borderError : ''} ${styles.input}`}
          onChange={onChangeHandler}
          type={type}
          placeholder={placeholder}
          value={value}
          name={name}
        />
        <i className={`${styles.icon} ${iconValue}`} />
        {showError && <i className={`${styles.errorIcon} fas fa-exclamation-circle`}></i>}
      </div>
      {showError && <div className={styles.errorText}>{errorMessage}</div>}
    </div>
  )
}
