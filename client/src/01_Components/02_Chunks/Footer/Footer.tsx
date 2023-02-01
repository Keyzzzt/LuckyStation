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
        <div className={s.topContent}>
          <div className={s.subscribeInput}>
            <div className={s.subtitle}>Let's get to work!</div>
            <h3
              className={s.title}>{!isSubscribed ? 'Subscribe to our newsletter and stay updated' : 'Make the right design-driven decisions, to move your inspiration forward.'}</h3>
            {!isSubscribed && <input type="text" placeholder='Your Email'/>}
          </div>
          <div className={s.customerService}>
            <div className={s.title}>Customer Service</div>
            <div className={s.phone}><a href="tel:+372 55 51 91 24">+372 55 51 91 24</a></div>
            <div className={s.time}>Mon - Fri: 10-17</div>
          </div>
        </div>
        <div className={s.bottomContent}>
          <ul className={s.menu}>
            <li><Link to='/'>Jobs</Link></li>
            <li><Link to='/'>Docs</Link></li>
            <li><Link to='/'>Contacts</Link></li>
          </ul>
          <ul className={s.menu}>
            <li><Link to='/'>FAQ</Link></li>
            <li><Link to='/'>About Us</Link></li>
            <li><Link to='/terms'>Terms of Service</Link></li>
          </ul>
          <ul className={s.menu}>
            <li><Link to='/'>Refund Policy</Link></li>
            <li><Link to='/'>Cookie Preferences</Link></li>
            <li><Link to='/'>Shipping</Link></li>
          </ul>
          <ul className={s.menu}>
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
    </footer>
  )
}
