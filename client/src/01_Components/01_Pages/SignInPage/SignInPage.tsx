import s from './signInPage.module.scss'
import { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { actions, loginThunk } from '../../../03_Reducers/authReducer'
import { isEmail } from '../../../04_Utils/utils'
import { CustomInput } from '../../02_Chunks/CustomInput/CustomInput'

export const SignInPage: FC = () => {
  const [inputError, setInputError] = useState(false)
  const [email, setEmail] = useState('1@1.com')
  const [password, setPassword] = useState('123456')

  const { fail: loginFail } = useTypedSelector(state => state.login)
  const { userInfo } = useTypedSelector(state => state.userInfo)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const redirect = location.search && location.search.split('=')[1]

  const resetLoginFail = () => {
    if (loginFail) {
      dispatch(actions.reset())
    }
  }

  useEffect(() => {
    if (userInfo) {
      redirect === 'shipping' ? navigate('/shipping') : navigate('/')
    }
  }, [userInfo])

  const handleSignIn = () => {
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
        <form className={s.form}>
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
            <label className='stationLabel' htmlFor="rememberMeLogin">Remember me</label>
          </div>
          <div className={s.restorePassword}>
            <Link className={s.restorePasswordLink} to="/restore">Forgot password?</Link>
          </div>
        </div>
        <input onClick={handleSignIn} className='stationSubmitBtn' type="button" value="Sign In"/>
        <div className={`stationLabel ${s.signInWith}`}>
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