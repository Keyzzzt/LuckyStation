/* eslint-disable no-useless-escape */
import styles from './CustomInput.module.scss'
import { FC, FocusEvent, ChangeEvent, useState, useEffect } from 'react'
import { isEmail } from '../../../04_Utils/utils'

type Props = {
  type: string
  placeholder: string
  name: string
  inputError: boolean
  returnValue(key: string, value: string): void
  setInputError(value: boolean): void
}

export const CustomInput: FC<Props> = ({ type, placeholder, name, inputError, returnValue, setInputError }) => {
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
    default:
      iconValue = ''
  }

  const [value, setValue] = useState('')
  const [errorMessage, setErrorMessage] = useState('Empty field')
  const [isDirty, setIsDirty] = useState(false)
  const showError = errorMessage && isDirty

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInputError(false)
    setValue(prev => e.target.value)
    // TODO: На этом примере показать что setValue(e.target.value) это асинхронная функция и поэтому необходим useEffect
    // Todo: Узнать как это называется в React
  }

  useEffect(() => {
    if (value !== '') {
      returnValue(name, value)
    }
  }, [value]) // inputError

  useEffect(() => {
    if (inputError) {
      setIsDirty(true)
    }
    returnValue(name, value) // ВАЖНО !!!
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
      case 'name':
        if (value.length > 1) {
          setErrorMessage('')
          break
        } else {
          setErrorMessage('Enter a valid name')
          break
        }
      case 'lastName':
        if (value.length > 1) {
          setErrorMessage('')
          break
        } else {
          setErrorMessage('Enter a valid name')
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
