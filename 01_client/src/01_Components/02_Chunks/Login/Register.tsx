/* eslint-disable no-useless-escape */
import styles from './Auth.module.scss'
import { FormEvent, FC, useEffect, useState, ChangeEvent } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { actions, registerThunk } from '../../../03_Reducers/user/userRegisterReducer'
import { CustomInput } from './CustomInput'
import { GoogleLogin } from './GoogleLogin'

//todo оповещение при удачной регистрации
//todo https://www.youtube.com/watch?v=yYq0rWESsNY - взять телефон отсюда

export const Register: FC = () => {
  const [email, setEmail] = useState('')
  const [emailDirty, setEmailDirty] = useState(false)
  const [emailError, setEmailError] = useState('Empty field')
  const [password, setPassword] = useState('')
  const [passwordDirty, setPasswordDirty] = useState(false)
  const [passwordError, setPasswordError] = useState('Empty field')
  const [confirm, setConfirm] = useState('')
  const [confirmDirty, setConfirmDirty] = useState(false)
  const [confirmError, setConfirmError] = useState('Empty field')
  const { userInfo } = useTypedSelector((state) => state.userInfo)
  const { registerFail, registerSuccess, registerLoading } = useTypedSelector((state) => state.userRegister)
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()

  const redirect = location.search ? location.search.split('=')[1] : '/'

  const showLoginError = registerFail && !emailError && !passwordError
  const showPasswordError = passwordError && passwordDirty
  const showConfirmError = confirmError && confirmDirty
  const showEmailError = emailError && emailDirty

  const blurHandler = (e: any) => {
    e.target.name === 'email' && setEmailDirty(true)
    e.target.name === 'password' && setPasswordDirty(true)
    e.target.name === 'confirm' && setConfirmDirty(true)
  }

  const registerReset = () => {
    if (registerFail) {
      dispatch(actions.registerResetAC())
    }
  }

  const emailHandler = (e: ChangeEvent<HTMLInputElement>) => {
    registerReset()
    setEmail(e.target.value)
    let isEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!e.target.value.toLocaleLowerCase().match(isEmail)) {
      setEmailError('Invalid email')
    } else {
      setEmailError('')
    }
  }

  const passwordHandler = (e: ChangeEvent<HTMLInputElement>) => {
    registerReset()

    if (e.target.value.length === 20) {
      e.target.name === 'password' && setPassword(() => e.target.value.substring(0, 20))
      e.target.name === 'confirm' && setConfirm(() => e.target.value.substring(0, 20))
    } else {
      e.target.name === 'password' && setPassword(e.target.value)
      e.target.name === 'confirm' && setConfirm(e.target.value)
    }
    if (e.target.value.length < 6) {
      e.target.name === 'password' && setPasswordError('Password length between 6 and 20 characters')
      e.target.name === 'confirm' && setConfirmError('Password length between 6 and 20 characters')
    } else {
      e.target.name === 'password' && setPasswordError('')
      e.target.name === 'confirm' && setConfirmError('')
    }
  }
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (emailError || passwordError || confirmError) {
      setEmailDirty(true)
      setPasswordDirty(true)
      setConfirmDirty(true)
      return
    }
    setEmailDirty(false)
    setPasswordDirty(false)
    setConfirmDirty(false)
    dispatch(registerThunk(email, password, confirm))
  }

  useEffect(() => {
    if (password !== confirm) {
      setConfirmError('Passwords do not match')
    }
  }, [password, confirm, confirmDirty])

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo])

  useEffect(() => {
    if (registerSuccess) {
      history.push(redirect)
      registerReset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerSuccess])

  return (
    <div className={styles.container}>
      <div className={styles.title}>Register</div>
      <form onSubmit={submitHandler}>
        <CustomInput showError={showEmailError} blurHandler={blurHandler} onChangeHandler={emailHandler} value={email} error={emailError} type="email" placeholder="Email" name="email" />
        <CustomInput showError={showPasswordError} blurHandler={blurHandler} onChangeHandler={passwordHandler} value={password} error={passwordError} type="password" placeholder="Password" name="password" />
        <CustomInput showError={showConfirmError} blurHandler={blurHandler} onChangeHandler={passwordHandler} value={confirm} error={confirmError} type="password" placeholder="Confirm password" name="confirm" />
        <input type="submit" value="Register" />
        {showLoginError && <div className={styles.errorText}>{registerFail}</div>}
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
