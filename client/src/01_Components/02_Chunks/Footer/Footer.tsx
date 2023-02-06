import { FC, FormEvent, useState } from 'react'
import s from './footer.module.scss'
import { Link } from 'react-router-dom'
import { isEmail } from '../../../04_Utils/utils'
import { useDispatch } from 'react-redux'
import { subscribeThunk } from '../../../03_Reducers/user/userInfoReducer'

interface Props {
  isSubscribed: boolean
}

export const Footer: FC<Props> = ({ isSubscribed }) => {
  const [email, setEmail] = useState('')
  const dispatch = useDispatch()

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isEmail(email)) {
      alert('Please enter a valid email')
      return
    } else {
      dispatch(subscribeThunk(email))
    }
  }
  return (
    <footer className={s.footer}>
      <div className={`stationContainer ${s.container}`}>
        <div className={s.content}>
          <div className={s.menu}>
            <ul className={s.subMenu}>
              <li><Link to='/'>Jobs</Link></li>
              <li><Link to='/'>Docs</Link></li>
              <li><Link to='/'>Contacts</Link></li>
            </ul>
            <ul className={s.subMenu}>
              <li><Link to='/'>FAQ</Link></li>
              <li><Link to='/'>About Us</Link></li>
              <li><Link to='/terms'>Terms of Service</Link></li>
            </ul>
          </div>
          <div className={s.menu}>
            <ul className={s.subMenu}>
              <li><Link to='/'>Refund Policy</Link></li>
              <li><Link to='/'>Cookie</Link></li>
              <li><Link to='/'>Shipping</Link></li>
            </ul>
            <ul className={s.subMenu}>
              <li>Let's chat!</li>
              <li>idea@station.app</li>
              <li className={s.socials}>
                <i className="fa-brands fa-facebook-f"/>
                <i className="fa-brands fa-twitter"/>
                <i className="fa-brands fa-linkedin-in"/>
                <i className="fa-brands fa-instagram"/>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
