/* eslint-disable no-useless-escape */
import styles from './Auth.module.scss'
import { FormEvent, FC, useEffect, useState, ChangeEvent } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { actions, loginThunk } from '../../../03_Reducers/authReducer'
import { CustomInput } from './CustomInput'
import { GoogleLogin } from './GoogleLogin'

export const Login: FC = () => {
  const [email, setEmail] = useState('')
  const [emailDirty, setEmailDirty] = useState(false)
  const [emailError, setEmailError] = useState('Empty email')
  const [password, setPassword] = useState('')
  const [passwordDirty, setPasswordDirty] = useState(false)
  const [passwordError, setPasswordError] = useState('Empty password')
  const { loginFail } = useTypedSelector((state) => state.login)
  const { userInfo } = useTypedSelector((state) => state.userInfo)
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()

  const redirect = location.search ? location.search.split('=')[1] : '/'

  const showLoginError = loginFail && !emailError && !passwordError
  const showPasswordError = passwordError && passwordDirty
  const showEmailError = emailError && emailDirty

  const blurHandler = (e: any) => {
    e.target.name === 'email' && setEmailDirty(true)
    e.target.name === 'password' && setPasswordDirty(true)
  }

  const resetLoginFail = () => {
    if (loginFail) {
      dispatch(actions.loginResetAC())
    }
  }

  const emailHandler = (e: ChangeEvent<HTMLInputElement>) => {
    resetLoginFail()
    setEmail(e.target.value)
    let isEmail =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!e.target.value.toLocaleLowerCase().match(isEmail)) {
      setEmailError('Invalid email')
    } else {
      setEmailError('')
    }
  }

  const passwordHandler = (e: ChangeEvent<HTMLInputElement>) => {
    resetLoginFail()
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
    dispatch(loginThunk(email, password))
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>Login</div>
      <form onSubmit={submitHandler}>
        <CustomInput
          showError={showEmailError}
          blurHandler={blurHandler}
          onChangeHandler={emailHandler}
          value={email}
          error={emailError}
          type="email"
          placeholder="Email"
          name="email"
        />
        <CustomInput
          showError={showPasswordError}
          blurHandler={blurHandler}
          onChangeHandler={passwordHandler}
          value={password}
          error={passwordError}
          type="password"
          placeholder="Password"
          name="password"
        />
        <input type="submit" value="Login" />
        {showLoginError && <div className={styles.errorText}>{loginFail}</div>}
      </form>
      <div className={styles.passLink}>
        <Link to="/restore">Forgot password?</Link>
      </div>
      <div className={styles.regLink}>
        Not yet member?
        <Link to="/register"> Register now!</Link>
      </div>
      <GoogleLogin />
    </div>
  )
}
