/* eslint-disable no-useless-escape */
import styles from './Register.module.scss'
import { FormEvent, FC, useEffect, useState, ChangeEvent } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { registerThunk } from '../../../03_Reducers/user/userRegisterReducer'

export const Register: FC = () => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [password, setPassword] = useState('')
  const [passwordCount, setPasswordCount] = useState(0)
  const [passwordError, setPasswordError] = useState('')
  const [confirm, setConfirm] = useState('')
  const [confirmCount, setConfirmCount] = useState(0)
  const [confirmError, setConfirmError] = useState('')

  const { error } = useTypedSelector((state) => state.userRegister)
  const { userInfo } = useTypedSelector((state) => state.userInfo)
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()

  const redirect = location.search ? location.search.split('=')[1] : '/'

  const loginDataHandler = (e: ChangeEvent<HTMLInputElement>, field: 'email' | 'password' | 'confirm') => {
    setEmailError('')
    setPasswordError('')
    setConfirmError('')
    if (field === 'email') {
      setEmail(e.target.value)
    } else if (field === 'password') {
      if (password.length === 20) {
        setPassword(() => e.target.value.substring(0, 20))
      } else {
        setPassword(e.target.value)
      }
    } else {
      setConfirm(e.target.value)
    }
  }

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let flag = true
    let isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

    if (!email.match(isEmail)) {
      flag = false
      setEmailError('Invalid email')
    }
    if (password.length < 6) {
      flag = false
      setPasswordError('Minimum length of 6 characters')
    }
    if (password !== confirm) {
      flag = false
      setConfirmError('Passwords do not match')
    }

    if (flag) dispatch(registerThunk(email, password, confirm))
  }

  useEffect(() => {
    setPasswordCount(() => password.length)
    setConfirmCount(() => confirm.length)
  }, [password, confirm])

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])

  return (
    <div className={styles.container}>
      <div className={styles.title}>Register</div>
      <form onSubmit={submitHandler}>
        <div className={`${styles.field} ${styles.email} ${emailError && styles.shake}`}>
          <div className={styles.inputArea}>
            <input className={emailError && styles.borderError} onChange={(e) => loginDataHandler(e, 'email')} type="text" placeholder="Email" />
            <i className={`${styles.icon} fas fa-envelope`}></i>
            {emailError && <i className={`${styles.errorIcon} fas fa-exclamation-circle`}></i>}
            {error && <div className={styles.errorText}>{error}</div>}
          </div>
          {emailError && <div className={styles.errorText}>{emailError}</div>}
        </div>
        <div className={`${styles.field} ${styles.password} ${passwordError && styles.shake}`}>
          <div className={styles.inputArea}>
            <input className={passwordError && styles.borderError} onChange={(e) => loginDataHandler(e, 'password')} type="password" placeholder="Password" value={password} />
            <i className={`${styles.icon} fas fa-lock`}></i>
            <span className={`${styles.counter} ${passwordCount >= 6 && styles.counterEnough}`}>{passwordCount}</span>
            {passwordError && <i className={`${styles.errorIcon} fas fa-exclamation-circle`}></i>}
          </div>
          {passwordError && <div className={styles.errorText}>{passwordError}</div>}
        </div>
        <div className={`${styles.field} ${styles.password} ${confirmError && styles.shake}`}>
          <div className={styles.inputArea}>
            <input className={confirmError && styles.borderError} onChange={(e) => loginDataHandler(e, 'confirm')} type="password" placeholder="Confirm" value={confirm} />
            <i className={`${styles.icon} fas fa-lock`}></i>
            <span className={`${styles.counter} ${confirmCount >= 6 && styles.counterEnough}`}>{confirmCount}</span>
            {confirmError && <i className={`${styles.errorIcon} fas fa-exclamation-circle`}></i>}
          </div>
          {confirmError && <div className={styles.errorText}>{confirmError}</div>}
        </div>

        <input type="submit" value="Register" />
      </form>
      <div className={styles.regLink}>
        Already have an account?
        <Link to="/login"> Login page</Link>
      </div>
      <div className={styles.google}>
        <a href="http://localhost:5000/api/auth/google/redirect">Login with Google</a>
      </div>
    </div>
  )
}
