import { FC, FormEvent, useState } from 'react'
import styles from './Footer.module.scss'
import { Link } from 'react-router-dom'
import { isEmail } from '../../../04_Utils/utils'
import { useDispatch } from 'react-redux'
import { subscribeThunk } from '../../../03_Reducers/user/userInfoReducer'
const footerColumns = [
  {
    id: 1,
    headline: 'About us',
    links: ['Pricing', 'Our Story', 'Testimonials', 'Investors', 'Terms of Service'],
  },
  {
    id: 2,
    headline: 'Contact us',
    links: ['Contact', 'Support', 'Destinations', 'Careers', 'Refund policy'],
  },
  {
    id: 3,
    headline: 'Content',
    links: ['Submit Video', 'Submit Photo', 'Influencer', 'Marketing', 'Privacy Policy'],
  },
  {
    id: 4,
    headline: 'Socials',
    links: ['Youtube', 'Facebook', 'Snapchat', 'Twitter', 'Instagram'],
  },
]

// const socials = [<FaYoutube />, <FaInstagram />, <FaTwitter />, <FaSnapchatGhost />, <FaFacebook />]

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
    <div className={styles.container}>
      <footer className={styles.footer}>
        {!isSubscribed && (
          <div className={styles.footer__newsletter}>
            <h4 className={styles.footer__newsletter__headline}>Join the Station newsletter to receive groundbreaking rewards</h4>
            <span>Unsubscribe at any time</span>
            <form onSubmit={submitHandler} className={styles.footer__newsletter__form}>
              <input onChange={(e) => setEmail(e.target.value)} className={styles.input} type="text" placeholder="Your Email" value={email} />
              <input type="submit" value="Subscribe" />
            </form>
          </div>
        )}
        <div className={styles.footer__content}>
          {footerColumns.map(({ id, headline, links }) => (
            <div key={id} className={styles.footer__content__col}>
              <div className={styles.footer__content__col__headline}>{headline}</div>
              <ul className={styles.footer__content__col__links}>
                {links.map((link, i) => (
                  <li key={i + 1}>
                    <a href="/">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={styles.footer__base}>
          <Link to="/">Logo</Link>
          <span className={styles.footer__base__year}>Station&nbsp;&copy;&nbsp;{new Date().getFullYear()}</span>
          <ul className={styles.footer__base__socials}>
            {/* {socials.map((socialIcon, i) => (
              <li key={i + 1}>
                <a href="/">{socialIcon}</a>
              </li>
            ))} */}
          </ul>
        </div>
      </footer>
    </div>
  )
}