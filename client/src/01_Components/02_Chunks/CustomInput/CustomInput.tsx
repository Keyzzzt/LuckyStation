import s from './customInput.module.scss'
import { FC, ChangeEvent, useState, useEffect } from 'react'
import { isEmail } from '../../../04_Utils/utils'

type CustomInputProps = {
  type: string
  placeholder: string
  id?: string
  label?: string
  name: string
  inputError: boolean
  value: string
  returnValue(value: string): void
  setInputError(value: boolean): void
}

export const CustomInput: FC<CustomInputProps> = ({ type, placeholder, name, inputError, returnValue, setInputError, label, value, id = '' }) => {
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
        if (value?.length >= 6) {
          setErrorMessage('')
          break
        } else {
          setErrorMessage('At least 6 characters')
          break
        }
      case 'confirmPassword':
        if (value?.length >= 6) {
          setErrorMessage('')
          break
        } else {
          setErrorMessage('At least 6 characters')
          break
        }
      default:
        if (value?.length > 1) {
          setErrorMessage('')
          break
        } else {
          setErrorMessage('Field is required')
          break
        }
    }
  }, [value])

  return (
    <div className={`${s.field} ${showError ? s.shake : ''}`}>
      <div className={s.inputArea}>
        {id && <label htmlFor={id} className='stationLabel'>{label}</label>}
        <input
          id={id}
          onBlur={() => setIsDirty(true)}
          className={`${showError ? s.borderError : ''} stationInput`}
          onChange={onChangeHandler}
          type={type}
          placeholder={placeholder}
          value={value}
          name={name}
        />
      </div>
      {showError && <div className={s.errorText}>{errorMessage}</div>}
    </div>
  )
}
