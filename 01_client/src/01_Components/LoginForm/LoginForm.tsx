import axios from 'axios'
import { useState } from 'react'
import { getGoogleOAuthURL } from '../../04_Utils/googleOauthURL'
import { useActions } from '../../04_Utils/hooks'
import s from './loginForm.module.scss'

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('tallinnn@hotmail.com')
  const [password, setPassword] = useState('123')

  const { loginUserThunk, registerUserThunk, logoutUserThunk } = useActions()

  const loginHandler = () => {
    loginUserThunk(email, password)
  }
  const registerHandler = () => {
    registerUserThunk(email, password)
  }
  const logoutHandler = () => {
    logoutUserThunk()
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
      <input onClick={logoutHandler} type="button" value="Logout" />

      <a href="http://localhost:5000/api/auth/google/redirect">GoogleWithProxy</a>
    </div>
  )
}
