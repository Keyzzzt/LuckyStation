import s from './AdminDashboard.module.scss'
import appsIcon from '../../../06_img/apps.svg'
import burger from '../../../06_img/burger.svg'
import close from '../../../06_img/close.svg'
import cartIcon from '../../../06_img/cart.svg'
import fullsScreenEnterIcon from '../../../06_img/fullscreenEnter.svg'
import fullsScreenExitIcon from '../../../06_img/fullscreenExit.svg'
import lightModeIcon from '../../../06_img/lightMode.svg'
import darkModeIcon from '../../../06_img/darkMode.svg'
import bell from '../../../06_img/bell.svg'
import lang from '../../../06_img/lang.svg'
import { ChangeEvent, FC, useState } from 'react'
import { useScrollToTop } from '../../../04_Utils/hooks'
import { Link, Outlet } from 'react-router-dom'


export const AdminDashboard: FC = () => {
  console.log('ADMIN DASHBOARD')
  const [fullscreen, setFullScreen] = useState(false)
  const [colorMode, setColorMode] = useState(true) // true === light mode
  const [sideMenu, setSideMenu] = useState(true) // false === icons

  const handleFullScreen = () => {
    setFullScreen(prev => !prev)
  }
  const handleColorMOde = () => {
    setColorMode(prev => !prev)
  }
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
  }
  const handleSideMenu = () => {
    setSideMenu(prev => !prev)
  }

  return (
    <div className={`stationContainer ${s.container}`}>
      <aside className={s.aside}>
        <ul className={s.navbarMenu}>
          <li className={s.station}>
            <Link to='/'>Station</Link>
          </li>
          <li className={s.menuItem}>
            <Link to='/dashboard'>MENU</Link>
          </li>
          <li className={s.menuItem}>
            <Link to='/dashboard/products/add'>Add product</Link>
          </li>
          <li className={s.menuItem}>
            <Link to='/dashboard/products'>Products</Link>
          </li>
          <li className={s.menuItem}>
            <Link to='/dashboard/users'>Users</Link>
          </li>
          <li className={s.menuItem}>
            <Link to='/dashboard/orders'>Orders</Link>
          </li>
          <li className={s.menuItem}>
            <Link to='/dashboard/gallery'>Gallery</Link>
          </li>
          <li className={s.menuItem}>
            <Link to='/dashboard/settings'>Settings</Link>
          </li>
          <li className={s.menuItem}>
            <Link to='/dashboard/api'>API</Link>
          </li>
        </ul>
      </aside>
      <main className={s.content}>
        <nav className={s.headerNav}>
          <div className={s.rightNav}>
            <img onClick={handleSideMenu} src={sideMenu ? burger : close} alt="menu"/>
            <input className={`stationInput ${s.input}`} onChange={handleSearch} type="text"
                   placeholder='Search...'/>
          </div>
          <ul className={s.leftNav}>
            <li><img src={lang} alt='icon'/></li>
            <li><img src={appsIcon} alt='icon'/></li>
            <li><img src={cartIcon} alt='icon'/></li>
            <li onClick={handleFullScreen}><img src={fullscreen ? fullsScreenExitIcon : fullsScreenEnterIcon}
                                                alt='icon'/></li>
            <li onClick={handleColorMOde}><img src={colorMode ? lightModeIcon : darkModeIcon} alt='icon'/></li>
            <li><img src={bell} alt='icon'/></li>
          </ul>
        </nav>
        <Outlet/>
      </main>
    </div>
  )
}
