import { FC, useEffect, useState } from 'react'
import s from './header.module.scss'
import globalStyle from './../../../02_Styles/global.module.scss'
import { Link, useNavigate } from 'react-router-dom'
import { useWindowSize } from '../../../04_Utils/hooks'
import { useDispatch } from 'react-redux'
import { logoutThunk } from '../../../03_Reducers/user/userInfoReducer'
import { actions as myOrdersActions } from '../../../03_Reducers/user/myOrdersReducer'
import { actions as orderInfoActions } from '../../../03_Reducers/order/orderInfoReducer'
import { useTypedSelector } from '../../../05_Types/01_Base'

type Props = {
  isAuth: boolean
  isAdmin: boolean
}

export const Header: FC<Props> = ({ isAuth, isAdmin }) => {
  const { header } = useTypedSelector((state) => state.components)
  const {menuItems, subtitle, title} = header
  const navigate = useNavigate()
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
    navigate('/dashboard')
  }
  const logoutHandler = () => {
    setMenuOpen(false)
    navigate('/')
    dispatch(logoutThunk())
    dispatch(myOrdersActions.myOrdersResetAC())
    dispatch(orderInfoActions.reset())
    //TODO: Здесь нужно сбросить все приватные данные
  }
  const publicMenu = menuItems.filter(el => el.type === 'public').map((el, i) => (
    isAuth && el.title === 'Login' ? null : (
      <li key={i} onClick={() => setMenuOpen(false)} className={s.menuItem}>
        <Link to={el.link}>{el.title}</Link>
      </li>
    )))
  const privateMenu = menuItems.filter(el=> el.type === 'private').map((el, i) => (
    el.title === 'Logout' ? (
      <li key={i} onClick={logoutHandler} className={s.menuItem}>
        <Link to={el.link}>{el.title}</Link>
      </li>
    ) : (
      <li key={i} onClick={() => setMenuOpen(false)} className={s.menuItem} >
        <Link to={el.link}>{el.title}</Link>
      </li>
    )),
  )
  const adminMenu = menuItems.filter(el => el.type === 'admin').map((el, i)=> (
    <li key={i} onClick={dashboardHandler} className={s.menuItem}>
      <Link to={el.link}>{el.title}</Link>
    </li>
  ))


  return (
    <>
      <header className={s.header}>
        <div className={globalStyle.container + ' ' + s.container}>
          <div className={s.logo}>
            <div className={s.logoTitle}>
              <Link to="/" className={s.logo}>
                {title}
              </Link>
            </div>
            <div className={s.logoSubtitle}>{subtitle}</div>
          </div>

          <nav className={`${s.menu} ${menuOpen && size.width! < 992 ? s.isMenu : ''}`}>
            <ul className={s.menuList}>
              {publicMenu}
              {isAuth && privateMenu}
              {isAdmin && adminMenu}
            </ul>
          </nav>

          <div className={s.burgerMenu}>
            {menuOpen ? (
              <i onClick={() => setMenuOpen(false)} className="fa-solid fa-xmark"/>
            ) : (
              <i onClick={() => setMenuOpen(true)} className="fa-solid fa-bars"/>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
