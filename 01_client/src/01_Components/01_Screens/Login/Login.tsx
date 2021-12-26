import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { authThunk } from '../../../03_Reducers/authReducer'
import { useTypedSelector } from '../../../05_Types/01_Base'
import styles from './Login.module.scss'

export const Login: React.FC = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [email, setEmail] = useState('a123@a.com')
  const [password, setPassword] = useState('zzxxccVV11!')
  const { userInfo } = useTypedSelector((state) => state.userInfo)

  useEffect(() => {
    if (userInfo) {
      history.push('/')
    }
  }, [history, userInfo])

  const submitHandler = (e: any) => {
    e.preventDefault()
    dispatch(authThunk.login(email, password))
  }

  return (
    <div className={styles.container}>
      <h1>Sign In</h1>
      <form onSubmit={submitHandler} noValidate>
        <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your Email" value={email} />
        <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Your Password" value={password} />
        <input type="submit" value="Login" />
        <div>
          New Customer?
          <Link to="/register">Register</Link>
        </div>
        <div>
          <a href="http://localhost:5000/api/auth/google/redirect">Login with Google</a>
        </div>
      </form>
    </div>
  )
}
