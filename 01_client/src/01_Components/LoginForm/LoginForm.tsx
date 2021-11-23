import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUserThunk, logoutUserThunk, registerUserThunk } from '../../03_Reducers/userReducers'
import { API } from '../../06_Services/API'
import s from './loginForm.module.scss'

export const LoginForm: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('tallinnn@hotmail.com')
  const [password, setPassword] = useState('123')
  const [profile, setProfile] = useState({})

  const dispatch = useDispatch()

  const loginHandler = () => {
    dispatch(loginUserThunk(email, password))
  }
  const registerHandler = () => {
    dispatch(registerUserThunk(name, email, password))
  }
  const logoutHandler = () => {
    dispatch(logoutUserThunk())
  }
  const googleOauth = async () => {}

  return (
    <div className={s.container}>
      <div className={s.container_form}>
        <input onChange={(e) => setEmail(e.target.value)} type="email" value={email} placeholder="Email" />
        <input onChange={(e) => setPassword(e.target.value)} type="password" value={password} placeholder="Password" />
        <input onClick={loginHandler} type="button" value="Login" />
      </div>
      <div className={s.container_form}>
        <input onChange={(e) => setName(e.target.value)} type="text" value={name} placeholder="Name" />
        <input onChange={(e) => setEmail(e.target.value)} type="email" value={email} placeholder="Email" />
        <input onChange={(e) => setPassword(e.target.value)} type="password" value={password} placeholder="Password" />
        <input onClick={registerHandler} type="button" value="Register" />
      </div>
      <input onClick={logoutHandler} type="button" value="Logout" />
      <button onClick={googleOauth}>Google OAUTH</button>
    </div>
  )
}
