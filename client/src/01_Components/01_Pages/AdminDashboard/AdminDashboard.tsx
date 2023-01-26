import s from './AdminDashboard.module.scss'
import { FC } from 'react'
import { useScrollToTop } from '../../../04_Utils/hooks'
import { Outlet, useNavigate } from 'react-router-dom'

export const AdminDashboard: FC = () => {
  const navigate = useNavigate()
  useScrollToTop()

  return (
    <div className={s.container}>
      <nav className={s.navbar}>
        <ul className={s.navbarMenu}>
          <li onClick={() => navigate('/dashboard')} className={s.luckyStation}>Lucky Station</li>
          <li onClick={() => navigate('/dashboard/products/add')} className={s.menuItem}>Add product</li>
          <li onClick={() => navigate('/dashboard/products')} className={s.menuItem}>Products</li>
          <li onClick={() => navigate('/dashboard/users')} className={s.menuItem}>Users</li>
          <li onClick={() => navigate('/dashboard/orders')} className={s.menuItem}>Orders</li>
          <li onClick={() => navigate('/dashboard/settings')} className={s.menuItem}>Settings</li>
          <li onClick={() => navigate('/dashboard/api')} className={s.menuItem}>API</li>
        </ul>
      </nav>
      <div className={s.content}>
        <Outlet />
      </div>
    </div>
  )
}
