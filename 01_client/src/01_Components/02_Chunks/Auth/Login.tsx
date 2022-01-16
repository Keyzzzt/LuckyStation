/* eslint-disable no-useless-escape */
import styles from './Auth.module.scss'
import { FormEvent, FC, useEffect, useState, ChangeEvent, FocusEvent } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { actions, loginThunk } from '../../../03_Reducers/authReducer'
import { CustomInput } from './CustomInput'
import { GoogleLogin } from './GoogleLogin'
import { isEmail } from '../../../04_Utils/utils'

export const Login: FC = () => {
  const [email, setEmail] = useState('a@a.com')
  const [emailDirty, setEmailDirty] = useState(false)
  const [emailError, setEmailError] = useState('Empty email')
  const [password, setPassword] = useState('zzxxccVV11!')
  const [passwordDirty, setPasswordDirty] = useState(false)
  const [passwordError, setPasswordError] = useState('Empty password')
  const { fail: loginFail } = useTypedSelector((state) => state.login)
  const { userInfo } = useTypedSelector((state) => state.userInfo)
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()

  const redirect = location.search ? location.search.split('=')[1] : '/'

  const showLoginError = loginFail && !emailError && !passwordError
  const showPasswordError = passwordError && passwordDirty
  const showEmailError = emailError && emailDirty

  const blurHandler = (e: FocusEvent<HTMLInputElement>) => {
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

    if (isEmail(email)) {
      setEmailError('')
    } else {
      setEmailError('Invalid email')
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

  // Обнуляет ошибки если поля заполнены заранее
  useEffect(() => {
    email.length > 0 && setEmailError('')
    password.length > 0 && setPasswordError('')
  }, [])

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
