import { FC, useEffect } from 'react'
import styles from './AdminDashboard.module.scss'
import { useHistory } from 'react-router'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { UsersList } from './UsersList/UsersList'
import { DashboardHeader } from './DashboardHeader/DashboardHeader'
import { Earnings } from './Earnings/Earnings'
import { ProductSales } from './ProductSales/ProductSales'
import { Totals } from './Totals/Totals'
import { useScrollToTop } from '../../../04_Utils/hooks'
import { ProductsList } from './ProductsList/ProductsList'

export const AdminDashboard: FC = () => {
  // useScrollToTop()
  const { config } = useTypedSelector((state) => state)
  const { userInfo } = useTypedSelector((state) => state.userInfo)
  const history = useHistory()
  // const dispatch = useDispatch()
  if (!userInfo) {
    history.push('/login?redirect=dashboard')
  }
  if (userInfo && !userInfo.isAdmin) {
    history.push('/')
  }
  const themeClass = config.colorTheme === 'light' ? styles.light_mode : styles.dark_mode

  useEffect(() => {}, [])
  return (
    <div className={`${styles.scroll} ${themeClass}`}>
      <div className={`${styles.container} ${themeClass}`}>
        <div className={`${styles.dashboard}`}>
          <DashboardHeader />
          <Totals />
          <Earnings />
          <div className={styles.dashboard__footer}>
            <ProductSales />
          </div>
          <UsersList />
          <ProductsList />
        </div>
      </div>
    </div>
  )
}
