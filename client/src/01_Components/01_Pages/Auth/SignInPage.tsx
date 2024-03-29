import s from './auth.module.scss'
import { FC, FormEvent, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { isEmail } from '../../../04_Utils/utils'
import { CustomInput } from '../../02_Chunks/CustomInput/CustomInput'
import { Button } from '../../02_Chunks/Button/Button'
import { signInTC } from '../../../03_Reducers/Auth/signInReducer'

export const SignInPage: FC = () => {
  const [inputError, setInputError] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {success: signInSuccess, loading: signInLoading, fail: signInFail} = useTypedSelector(state => state.signIn)
  const { userInfo } = useTypedSelector(state => state.userInfo)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const redirect = location.search && location.search.split('=')[1]

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
    dispatch(signInTC(email, password))
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
          <Button title='Sign In' type='submit' color='success' marginTop='20px' />
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