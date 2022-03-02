import { FC, useEffect, useState } from 'react'
import styles from './Header.module.scss'
import { Link, useHistory } from 'react-router-dom'
import { useWindowSize } from '../../../04_Utils/hooks'
import { useDispatch } from 'react-redux'
import { logoutThunk } from '../../../03_Reducers/user/userInfoReducer'
import { actions as myOrdersActions } from '../../../03_Reducers/user/myOrdersReducer'
import { actions as orderInfoActions } from '../../../03_Reducers/order/orderInfoReducer'
import { TopBanner } from '../Banners/Banners'

interface Props {
  isAuth: boolean
  isAdmin: boolean | undefined
}

export const Header: FC<Props> = ({ isAuth, isAdmin }) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [menuOpen, setMenuOpen] = useState(false)
  const size = useWindowSize()

  useEffect(() => {
    if (size.width! > 992 && menuOpen) {
      setMenuOpen(false)
    }
  }, [size, menuOpen])

  const dashboardHandler = () => {
    setMenuOpen(false)
    history.push('/dashboard')
  }
  const logoutHandler = () => {
    setMenuOpen(false)
    history.push('/')
    dispatch(logoutThunk())
    dispatch(myOrdersActions.myOrdersResetAC())
    dispatch(orderInfoActions.reset())
    //TODO: Здесь нужно сбросить все приватные данные
  }
  return (
    <>
      <TopBanner placeholder="Click to toggle color theme..." />
      <header className={styles.header}>
        <div className={styles.header__content}>
          <div className={styles.logo}>
            <Link to="/" className={styles.logo}>
              Lucky Station
              <div className={styles.logoTitle}>fullstack web studio</div>
            </Link>
          </div>

          <nav className={`${styles.menu} ${menuOpen && size.width! < 992 ? styles.isMenu : ''}`}>
            <ul>
              <li>
                <Link to="/products" onClick={() => setMenuOpen(false)}>
                  PRODUCTS
                </Link>
              </li>
              <li>
                <Link to="/services" onClick={() => setMenuOpen(false)}>
                  SERVICES
                </Link>
              </li>
              <li>
                <Link to="/about" onClick={() => setMenuOpen(false)}>
                  ABOUT
                </Link>
              </li>
              <li>
                <Link to="/help" onClick={() => setMenuOpen(false)}>
                  HELP
                </Link>
              </li>
            </ul>
            <ul>
              <li>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href="#">
                  <i className="fa-solid fa-magnifying-glass" />
                </a>
              </li>

              <li>
                <Link to="/cart" onClick={() => setMenuOpen(false)}>
                  <i className="fas fa-shopping-cart" />
                </Link>
              </li>
              {isAuth && (
                <li onClick={logoutHandler}>
                  <Link to="/cart" onClick={() => setMenuOpen(false)}>
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                  </Link>
                </li>
              )}
              {isAuth && !isAdmin && (
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
              )}
              {!isAuth && (
                <li>
                  <Link to="/login" onClick={() => setMenuOpen(false)}>
                    <i className="fa-solid fa-arrow-right-to-bracket"></i>
                  </Link>
                </li>
              )}
              {isAdmin && (
                <li className="dashboard" onClick={dashboardHandler}>
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                    <i className="fa-solid fa-gears"></i>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          <div className={styles.header__content__toggle}>
            {menuOpen ? (
              <div className={styles.temp1} onClick={() => setMenuOpen(false)}>
                <i className="fa-solid fa-xmark" />
              </div>
            ) : (
              <div onClick={() => setMenuOpen(true)} className={styles.temp2}>
                <i className="fa-solid fa-bars"></i>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
