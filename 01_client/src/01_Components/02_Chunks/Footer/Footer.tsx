import { FC } from 'react'
import styles from './Footer.module.scss'
import { Link } from 'react-router-dom'
import { useTypedSelector } from '../../../05_Types/01_Base'
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

export const Footer: FC = () => {
  const { userInfo } = useTypedSelector((state) => state.userInfo)
  return (
    <div className={styles.container}>
      <footer className={styles.footer}>
        {!userInfo?.isSubscribed && (
          <div className={styles.footer__newsletter}>
            <h4 className={styles.footer__newsletter__headline}>Join the Station newsletter to receive groundbreaking rewards</h4>
            <span>Unsubscribe at any time</span>
            <div className={styles.footer__newsletter__form}>
              <input className={styles.input} type="email" placeholder="Your Email" />
              <button>Subscribe</button>
            </div>
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
