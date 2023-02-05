import s from './auth.module.scss'
import { FC, FormEvent, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { actions, loginThunk } from '../../../03_Reducers/authReducer'
import { isEmail } from '../../../04_Utils/utils'
import { CustomInput } from '../../02_Chunks/CustomInput/CustomInput'

export const SignInPage: FC = () => {
  console.log('SIGN IN')

  const [inputError, setInputError] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
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
    <div className='stationSectionMain'>
      <main className={`stationContainer ${s.authContainer}`}>
        <p className={s.signInTitle}>Welcome Back !</p>
        <p className={s.signInSubtitle}>Sign in to continue to Station</p>
        <form className={s.form} onSubmit={handleSubmit}>
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
          <div className={s.rememberRestore}>
            <div className={s.rememberMe}>
              <input type="checkbox" id='rememberMeLogin'/>
              <label className='stationLabel' htmlFor="rememberMeLogin">Remember me</label>
            </div>
          </div>
          <input className='stationSubmitBtn' type="submit" value="Sign In"/>
        </form>

        <div className={`stationLabel ${s.signInWith}`}>Sign In with</div>
        <div className={s.socialsSignIn}>
          <a href="http://localhost:5000/api/auth/google/redirect">
            <i className={`fa-brands fa-google ${s.googleIcon}`}/>
          </a>
        </div>
        <p className={s.signUpLink}>Don't have an account ? <Link to='/signup'>Signup</Link></p>
        <div className={s.restorePassword}>
          <Link className={s.restorePasswordLink} to="/recovery">Forgot password?</Link>
        </div>
      </main>
    </div>
  )
}