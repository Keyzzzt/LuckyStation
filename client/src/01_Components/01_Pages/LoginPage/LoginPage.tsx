import s from './loginPage.module.scss'
import globalStyles from './../../../02_Styles/global.module.scss'
import { FormEvent, FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { actions, loginThunk } from '../../../03_Reducers/authReducer'
import { isEmail } from '../../../04_Utils/utils'
import { CustomInput } from '../../02_Chunks/CustomInput/CustomInput'

export const LoginPage: FC = () => {
  const [inputError, setInputError] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
      <header className={s.header}>
        <Link to='/' className={s.pageTitle}>Station</Link>
        <h2 className={s.pageSubtitle}>Premium furniture online store</h2>
      </header>
      <main className={s.authContainer}>
        <p className={s.signInTitle}>Welcome Back !</p>
        <p className={s.signInSubtitle}>Sign in to continue to Station</p>
        <form onSubmit={submitHandler} className={s.form}>
          <CustomInput
            id={'loginEmail'}
            label='Username'
            returnValue={setEmail}
            setInputError={setInputError}
            inputError={inputError}
            type="text"
            placeholder="Enter email"
            name="email"
            value={email}
          />
          <CustomInput
            id='loginPassword'
            label='Password'
            returnValue={setPassword}
            setInputError={setInputError}
            inputError={inputError}
            type="password"
            placeholder="Enter password"
            name="password"
            value={password}
          />
        </form>
        <div className={s.rememberRestore}>
          <div className={s.rememberMe}>
            <input type="checkbox" id='rememberMeLogin'/>
            <label className={globalStyles.label} htmlFor="rememberMeLogin">Remember me</label>
          </div>
          <div className={s.restorePassword}>
            <Link className={s.restorePasswordLink} to="/restore">Forgot password?</Link>
          </div>
        </div>
        <input className={s.submitButton} type="submit" value="Sign In"/>
        <div className={globalStyles.label + ' ' + s.signInWith}>
          <p>Sign In with</p>
        </div>
        <div className={s.socialsSignIn}>
          <a href="http://localhost:5000/api/auth/google/redirect">
            <i className={`fa-brands fa-google ${s.googleIcon}`}/>
          </a>
        </div>
      </main>
      <footer className={s.footer}>
        <p className={s.signUpLink}>Don't have an account ? <Link to='/signup'>Signup</Link></p>
        <p className={s.copyrights}>© 2023 Lucky Station. Crafted with love by LuckyTeam </p>
      </footer>
    </div>
  )
}