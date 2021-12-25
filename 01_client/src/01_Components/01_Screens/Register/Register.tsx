import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { registerThunk } from '../../../03_Reducers/user/userRegisterReducer'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { ErrorMessage } from '../../02_Chunks/ErrorMessage/ErrorMessage'
import styles from './Register.module.scss'

export const Register: React.FC = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [email, setEmail] = useState('a@a.com')
  const [password, setPassword] = useState('zzxxccVV11!')
  const [confirmPassword, setConfirmPassword] = useState('zzxxccVV11!')
  const { auth } = useTypedSelector((state) => state)

  useEffect(() => {
    if (auth.isAuth) {
      history.push('/')
    }
  }, [history, auth.isAuth])

  const submitHandler = (e: any) => {
    e.preventDefault()
    if (password === confirmPassword) {
      dispatch(registerThunk(email, password, confirmPassword))
    } else {
      // TODO:
    }
  }

  return (
    <div className={styles.container}>
      <h1>Sign In</h1>
      <form onSubmit={submitHandler} noValidate>
        <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your Email" value={email} />
        <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Your Password" value={password} />
        <input onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="Your Password" value={confirmPassword} />
        <input type="submit" value="Register" />
        <div>
          Have an account?
          <Link to="/login">Login</Link>
        </div>
        <div>
          <a href="http://localhost:5000/api/auth/google/redirect">Google</a>
        </div>
      </form>
    </div>
  )
}
