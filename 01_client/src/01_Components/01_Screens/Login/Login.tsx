import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { userThunk } from '../../../03_Reducers/userReducers'
import { useTypedSelector } from '../../../05_Types/01_Base'
import s from './Login.module.scss'

export const Login: React.FC = () => {
  const [email, setEmail] = useState('a@a.com')
  const [password, setPassword] = useState('zzxxccVV11!')
  const dispatch = useDispatch()
  const { isAuth } = useTypedSelector((state) => state.auth)

  const loginHandler = () => {
    dispatch(userThunk.login(email, password))
  }
  const registerHandler = () => {
    dispatch(userThunk.register(email, password))
  }
  const logoutHandler = () => {
    dispatch(userThunk.logout())
  }
  return (
    <div className={s.container}>
      <div className={s.container_form}>
        <input onChange={(e) => setEmail(e.target.value)} type="email" value={email} placeholder="Email" />
        <input onChange={(e) => setPassword(e.target.value)} type="password" value={password} placeholder="Password" />
        <input onClick={loginHandler} type="button" value="Login" />
      </div>
      <div className={s.container_form}>
        <input onChange={(e) => setEmail(e.target.value)} type="email" value={email} placeholder="Email" />
        <input onChange={(e) => setPassword(e.target.value)} type="password" value={password} placeholder="Password" />
        <input onClick={registerHandler} type="button" value="Register" />
      </div>
      {isAuth && <input onClick={logoutHandler} type="button" value="Logout" />}

      <a href="http://localhost:5000/api/auth/google/redirect">GoogleWithProxy</a>
    </div>
  )
}
