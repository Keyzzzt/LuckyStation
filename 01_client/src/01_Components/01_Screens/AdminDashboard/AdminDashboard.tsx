import { FC, useEffect } from 'react'
import styles from './AdminDashboard.module.scss'
import { useHistory } from 'react-router'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { UsersList } from './UsersList/UsersList'
import { DashboardHeader } from './DashboardHeader/DashboardHeader'
import { Earnings } from './Earnings/Earnings'
import { ProductSales } from './ProductSales/ProductSales'
import { Totals } from './Totals/Totals'
import { ProductsList } from './ProductsList/ProductsList'
import { OrderList } from './OrderList/OrderList'
import { useIsAdminRedirect, useScrollToTop } from '../../../04_Utils/hooks'

export const AdminDashboard: FC = () => {
  const { userInfo } = useTypedSelector((state) => state.userInfo)
  const history = useHistory()
  useIsAdminRedirect(userInfo, history)

  useScrollToTop()
  const { config } = useTypedSelector((state) => state)
  const themeClass = config.colorTheme === 'light' ? styles.light_mode : styles.dark_mode

  useEffect(() => {}, [])
  return (
    <div className={`${styles.scroll} ${themeClass}`}>
      <div className={`${styles.container} ${themeClass}`}>
        <div className={`${styles.dashboard}`}>
          <OrderList />
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
