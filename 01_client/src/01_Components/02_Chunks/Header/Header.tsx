import { useEffect, useState } from 'react'
import styles from './Header.module.scss'
import { BiMenuAltRight } from 'react-icons/bi'
import { AiOutlineClose } from 'react-icons/ai'
import { Link, useHistory } from 'react-router-dom'
import { useWindowSize } from '../../../04_Utils/hooks'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { useDispatch } from 'react-redux'
import { logoutThunk } from '../../../03_Reducers/user/userInfoReducer'

export const Header = () => {
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
    dispatch(logoutThunk())
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
            {!userInfo && (
              <li>
                <Link to="/register" onClick={toggleMenuHandler}>
                  Register
                </Link>
              </li>
            )}
          </ul>
          {userInfo?.isAdmin && <button onClick={dashboardHandler}>Dashboard</button>}
        </nav>
        <div className={styles.header__content__toggle}>
          {menuOpen ? <AiOutlineClose onClick={toggleMenuHandler} /> : <BiMenuAltRight onClick={toggleMenuHandler} />}
        </div>
      </div>
    </header>
  )
}
