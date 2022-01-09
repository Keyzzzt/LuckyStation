/* eslint-disable no-useless-escape */
import { FormEvent, FC, useEffect, useState, ChangeEvent } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { authThunk } from '../../../03_Reducers/authReducer'
import { useTypedSelector } from '../../../05_Types/01_Base'
import styles from './Login.module.scss'
import { actions } from '../../../03_Reducers/authReducer'

export const Login: FC = () => {
  const [email, setEmail] = useState('')
  const [emailDirty, setEmailDirty] = useState(false)
  const [emailError, setEmailError] = useState('Empty email')
  const [password, setPassword] = useState('')
  const [passwordDirty, setPasswordDirty] = useState(false)
  const [passwordCount, setPasswordCount] = useState(0)
  const [passwordError, setPasswordError] = useState('Empty password')
  let { error } = useTypedSelector((state) => state.auth)
  const { userInfo } = useTypedSelector((state) => state.userInfo)
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()
  const redirect = location.search ? location.search.split('=')[1] : '/'

  const blurHandler = (e: any) => {
    e.target.name === 'email' && setEmailDirty(true)
    e.target.name === 'password' && setPasswordDirty(true)
  }

  const resetStateError = () => {
    if (error) {
      dispatch(actions.loginResetAC())
    }
  }

  const emailHandler = (e: ChangeEvent<HTMLInputElement>) => {
    resetStateError()
    setEmail(e.target.value)
    let isEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!e.target.value.toLocaleLowerCase().match(isEmail)) {
      setEmailError('Invalid email')
    } else {
      setEmailError('')
    }
  }

  const passwordHandler = (e: ChangeEvent<HTMLInputElement>) => {
    resetStateError()
    if (e.target.value.length === 20) {
      setPassword(() => e.target.value.substring(0, 20))
    } else {
      setPassword(e.target.value)
    }
    if (e.target.value.length < 6) {
      setPasswordError('Password length between 6 and 20 characters')
    } else {
      setPasswordError('')
    }
  }

  useEffect(() => {
    setPasswordCount(() => password.length)
  }, [password])

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (emailError || passwordError) {
      setEmailDirty(true)
      setPasswordDirty(true)
      return
    }
    setEmailDirty(false)
    setPasswordDirty(false)
    dispatch(authThunk.login(email, password))
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>Login</div>
      <form onSubmit={submitHandler}>
        <div className={`${styles.field} ${styles.email} ${emailError && emailDirty ? styles.shake : ''}`}>
          <div className={styles.inputArea}>
            <input onBlur={blurHandler} className={emailError && emailDirty ? styles.borderError : ''} onChange={emailHandler} type="text" placeholder="Email" value={email} name="email" />
            <i className={`${styles.icon} fas fa-envelope`}></i>
            {emailError && emailDirty && <i className={`${styles.errorIcon} fas fa-exclamation-circle`}></i>}
          </div>
          {emailError && emailDirty && <div className={styles.errorText}>{emailError}</div>}
        </div>
        <div className={`${styles.field} ${styles.password} ${passwordError && passwordDirty ? styles.shake : ''}`}>
          <div className={styles.inputArea}>
            <input onBlur={blurHandler} className={passwordError && passwordDirty ? styles.borderError : ''} onChange={passwordHandler} type="password" placeholder="Password" value={password} name="password" />
            <i className={`${styles.icon} fas fa-lock`}></i>
            <span className={`${styles.counter} ${passwordCount >= 6 && styles.counterEnough}`}>{passwordCount}</span>
            {passwordError && passwordDirty && <i className={`${styles.errorIcon} fas fa-exclamation-circle`}></i>}
          </div>
          {passwordError && passwordDirty && <div className={styles.errorText}>{passwordError}</div>}
          {error && !emailError && !passwordError && <div className={styles.errorText}>{error}</div>}
        </div>

        <input type="submit" value="Login" />
      </form>
      <div className={styles.passLink}>
        <Link to="/restore">Forgot password?</Link>
      </div>
      <div className={styles.regLink}>
        Not yet member?
        <Link to="/register"> Register now!</Link>
      </div>
      <div className={styles.google}>
        <a href="http://localhost:5000/api/auth/google/redirect">Login with Google</a>
      </div>
    </div>
  )
}
