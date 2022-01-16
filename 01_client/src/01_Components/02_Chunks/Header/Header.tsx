import { FC, useEffect, useState } from 'react'
import styles from './Header.module.scss'
import { Link, useHistory } from 'react-router-dom'
import { useWindowSize } from '../../../04_Utils/hooks'
import { useDispatch } from 'react-redux'
import { logoutThunk } from '../../../03_Reducers/user/userInfoReducer'
import { actions as myOrdersActions } from '../../../03_Reducers/user/myOrdersReducer'
import { actions as orderInfoActions } from '../../../03_Reducers/order/orderInfoReducer'
import { Search } from '../Search/Search'

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
    if (size.width! > 768 && menuOpen) {
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
    dispatch(orderInfoActions.orderInfoResetAC())
    //TODO: Здесь нужно сбросить все приватные данные
  }
  return (
    <header className={styles.header}>
      <div className={styles.header__content}>
        <Link to="/" className={styles.header__content__logo}>
          LOGO
        </Link>

        <nav className={`${styles.header__content__nav} ${menuOpen && size.width! < 768 ? styles.isMenu : ''}`}>
          <ul>
            <li>
              <Search />
            </li>
            <li>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/cart" onClick={() => setMenuOpen(false)}>
                <i className="fas fa-shopping-cart"></i>
                Cart
              </Link>
            </li>
            {isAuth && <li onClick={logoutHandler}>Logout</li>}
            {isAuth && (
              <li>
                <Link to="/profile">Profile</Link>
              </li>
            )}
            {!isAuth && (
              <li>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
              </li>
            )}
          </ul>
          {isAdmin && <button onClick={dashboardHandler}>Dashboard</button>}
        </nav>
        <div className={styles.header__content__toggle}>
          {menuOpen ? (
            <div className={styles.temp1} onClick={() => setMenuOpen(false)}>
              Close
            </div>
          ) : (
            <div onClick={() => setMenuOpen(true)} className={styles.temp2}>
              Open
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
