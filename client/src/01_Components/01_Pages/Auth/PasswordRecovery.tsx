import s from './auth.module.scss'
import { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { CustomInput } from '../../02_Chunks/CustomInput/CustomInput'
import { registerThunk } from '../../../03_Reducers/user/userRegisterReducer'
import { isEmail } from '../../../04_Utils/utils'

export const PasswordRecovery: FC = () => {
  const [inputError, setInputError] = useState(false)
  const [email, setEmail] = useState('ko@koa.com')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Обнуляет ошибки если поля заполнены браузером атоматом
  useEffect(() => {
    email.length > 0 && setInputError(false)
  }, [])


  const handleRecoverPassword = () => {
    if (isEmail(email)) {
      setInputError(false)
    } else {
      setInputError(true)
      return
    }
    dispatch(registerThunk(email, '', ''))
    alert('This feature is not working yet. But thank you for the effort.')
    navigate('/')
  }
  return (
    <div className='stationSectionMain'>

      <main className={`stationContainer ${s.authContainer}`}>
        <p className={s.signInTitle}>Welcome to Station!</p>
        <p className={s.signInSubtitle}>Passsword recovery</p>
        <form className={s.form}>
          <CustomInput
            id={'recoveryEmail'}
            label='Email'
            returnValue={setEmail}
            setInputError={setInputError}
            inputError={inputError}
            type="text"
            placeholder="Enter email"
            name="email"
            value={email}
          />
        </form>

        <input onClick={handleRecoverPassword} className='stationSubmitBtn' type="button" value="Email me"/>
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