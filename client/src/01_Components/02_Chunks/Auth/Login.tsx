/* eslint-disable no-useless-escape */
import s from './auth.module.scss'
import { FormEvent, FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { actions, loginThunk } from '../../../03_Reducers/authReducer'
import { GoogleLogin } from './GoogleLogin'
import { isEmail } from '../../../04_Utils/utils'
import { CustomInput } from '../CustomInput/CustomInput'

export const Login: FC = () => {
  const [inputError, setInputError] = useState(false)
  const [email, setEmail] = useState('1@1.com')
  const [password, setPassword] = useState('123456')

  const { fail: loginFail } = useTypedSelector(state => state.login)
  const { userInfo } = useTypedSelector(state => state.userInfo)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const redirect = location.search ? location.search.split('=')[1] : '/'

  const resetLoginFail = () => {
    if (loginFail) {
      dispatch(actions.reset())
    }
  }

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, userInfo, redirect])

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isEmail(email) && password.length >= 6) {
      setInputError(false)
    } else {
      setInputError(true)
      return
    }
    dispatch(loginThunk(email, password))
  }

  return (
    <div className={s.container}>
      <div className={s.title}>Login</div>
      <form onSubmit={submitHandler}>
        <CustomInput
          returnValue={setEmail}
          setInputError={setInputError}
          inputError={inputError}
          type="text"
          placeholder="Email"
          name="email"
          value={email}
        />
        <CustomInput
          returnValue={setPassword}
          setInputError={setInputError}
          inputError={inputError}
          type="password"
          placeholder="Password"
          name="password"
          value={password}
        />
        <input type="submit" value="Login" />
      </form>
      <div className={s.passLink}>
        <Link to="/restore">Forgot password?</Link>
      </div>
      <div className={s.regLink}>
        Not yet member?
        <Link to="/register"> Register now!</Link>
      </div>
      <GoogleLogin />
    </div>
  )
}
