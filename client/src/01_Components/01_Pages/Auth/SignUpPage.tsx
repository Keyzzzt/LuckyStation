import s from './auth.module.scss'
import { FC, FormEvent, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { actions } from '../../../03_Reducers/user/userRegisterReducer'
import { CustomInput } from '../../02_Chunks/CustomInput/CustomInput'
import { registerThunk } from '../../../03_Reducers/user/userRegisterReducer'
import { isEmail } from '../../../04_Utils/utils'
import { Button } from '../../02_Chunks/Button/Button'

export const SignUpPage: FC = () => {
  const [inputError, setInputError] = useState(false)
  const [email, setEmail] = useState('ko@koa.com')
  const [password, setPassword] = useState('123456')
  const [confirmPassword, setConfirmPassword] = useState('123456')

  const { registerFail, registerSuccess } = useTypedSelector(state => state.userRegister)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const registerReset = () => {
    if (registerFail) {
      dispatch(actions.registerResetAC())
    }
  }
  // Обнуляет ошибки если поля заполнены браузером атоматом
  useEffect(() => {
    email.length > 0 && setInputError(false)
    password.length > 0 && setInputError(false)
    confirmPassword.length > 0 && setInputError(false)
  }, [])

  useEffect(() => {
    if (password !== confirmPassword) {
      setInputError(true)
    }
  }, [])

  useEffect(() => {
    if (registerSuccess) {
      dispatch(actions.registerResetAC())
      alert(`We have sent confirmation link to ${email}`)
      setEmail('')
      setConfirmPassword('')
      setPassword('')
      navigate('/')
    }
  }, [registerSuccess])
  useEffect(() => {
    if (registerFail) {
      alert(registerFail)
    }
  }, [registerFail])
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isEmail(email) && password.length >= 6 && password === confirmPassword) {
      setInputError(false)
    } else {
      setInputError(true)
      return
    }
    dispatch(registerThunk(email, password, confirmPassword))
  }
  return (
    <div className='stationSectionMain'>
      <main className={`stationContainer ${s.authContainer}`}>
        <p className={s.signInTitle}>Welcome!</p>
        <p className={s.signInSubtitle}>Sign up to Station</p>
        <form className={s.form} onSubmit={handleSubmit}>
          <CustomInput
            id={'signUpEmail'}
            label='Email'
            returnValue={setEmail}
            setInputError={setInputError}
            inputError={inputError}
            type="text"
            placeholder="Enter email"
            name="email"
            value={email}
          />
          <CustomInput
            id='signUpPassword'
            label='Password'
            returnValue={setPassword}
            setInputError={setInputError}
            inputError={inputError}
            type="password"
            placeholder="Enter password"
            name="password"
            value={password}
          />
          <CustomInput
            id='signUpConfirmPassword'
            label='Confirm password'
            returnValue={setConfirmPassword}
            setInputError={setInputError}
            inputError={inputError}
            type="password"
            placeholder="Repeat password"
            name="confirmPassword"
            value={confirmPassword}
          />
          <div className={s.rememberRestore}>
            <div className={s.rememberMe}>
              <input type="checkbox" id='rememberMeLogin'/>
              <label className='stationLabel' htmlFor="rememberMeLogin">Remember me</label>
            </div>
            <div className={s.restorePassword}>
              <Link className={s.restorePasswordLink} to="/recovery">Forgot password?</Link>
            </div>
          </div>
          <Button title='Sign Up' type='submit' color='success' marginTop='20px'/>
        </form>

        <div className={`stationLabel ${s.signInWith}`}>Sign Up with</div>
        <div className={s.socialsSignIn}>
          <a href="http://localhost:5000/api/auth/google/redirect">
            <i className={`fa-brands fa-google ${s.googleIcon}`}/>
          </a>
        </div>
        <p className={s.signUpLink}>Already have an account? <Link to='/signin'>Sign in</Link></p>
      </main>
    </div>
  )
}