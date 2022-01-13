import { FC, useEffect, useState } from 'react'
import styles from './Header.module.scss'
import { Link, useHistory } from 'react-router-dom'
import { useWindowSize } from '../../../04_Utils/hooks'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { useDispatch } from 'react-redux'
import { logoutThunk } from '../../../03_Reducers/user/userInfoReducer'
import { actions as myOrdersActions } from '../../../03_Reducers/user/myOrdersReducer'
import { actions as orderInfoActions } from '../../../03_Reducers/order/orderInfoReducer'
import { Search } from '../Search/Search'

export const Header: FC = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [menuOpen, setMenuOpen] = useState(false)

  const { userInfo } = useTypedSelector((state) => state.userInfo)

  const size = useWindowSize()

  useEffect(() => {
    if (size.width! > 768 && menuOpen) {
      setMenuOpen(false)
    }
  }, [size, menuOpen])

  const toggleMenuHandler = () => {
    setMenuOpen((prev) => !prev)
  }
  const dashboardHandler = () => {
    toggleMenuHandler()
    history.push('/dashboard')
  }
  const logoutHandler = () => {
    toggleMenuHandler()
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
              <Link to="/" onClick={toggleMenuHandler}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/cart" onClick={toggleMenuHandler}>
                <i className="fas fa-shopping-cart"></i>
                Cart
              </Link>
            </li>
            {userInfo && <li onClick={logoutHandler}>Logout</li>}
            {userInfo && (
              <li>
                <Link to="/profile">Profile</Link>
              </li>
            )}
            {!userInfo && (
              <li>
                <Link to="/login" onClick={toggleMenuHandler}>
                  Login
                </Link>
              </li>
            )}
          </ul>
          {userInfo?.isAdmin && <button onClick={dashboardHandler}>Dashboard</button>}
        </nav>
        <div className={styles.header__content__toggle}>
          {menuOpen ? (
            <div className={styles.temp1} onClick={toggleMenuHandler}>
              Close
            </div>
          ) : (
            <div onClick={toggleMenuHandler} className={styles.temp2}>
              Open
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
