import { FC, useEffect } from 'react'
import styles from './AdminDashboard.module.scss'
import { useHistory } from 'react-router'
import { useTypedSelector } from '../../../05_Types/01_Base'
// import { UsersList } from './UsersList/UsersList'
// import { DashboardHeader } from './DashboardHeader/DashboardHeader'
// import { Earnings } from './Earnings/Earnings'
// import { ProductSales } from './ProductSales/ProductSales'
// import { Totals } from './Totals/Totals'
// import { ProductsList } from './ProductsList/ProductsList'
// import { OrderList } from './OrderList/OrderList'
import { useIsAdminRedirect, useScrollToTop } from '../../../04_Utils/hooks'
import { RemoveEmailFromList } from './RemoveEmailFromList/RemoveEmailFromList'
import { statisticThunk } from '../../../03_Reducers/Statistic/statisticReducer'
import { useDispatch } from 'react-redux'
import { SurveyScreen } from './SurveyScreen/SurveyScreen'

export const AdminDashboard: FC = () => {
  const { userInfo } = useTypedSelector((state) => state.userInfo)
  const { statistic } = useTypedSelector((state) => state.statistic)
  const history = useHistory()
  const dispatch = useDispatch()
  useIsAdminRedirect(userInfo, history)

  useScrollToTop()
  const { config } = useTypedSelector((state) => state)
  const themeClass = config.colorTheme === 'light' ? styles.light_mode : styles.dark_mode

  useEffect(() => {
    dispatch(statisticThunk())
  }, [])
  return (
    <div className={`${styles.scroll} ${themeClass}`}>
      <div className={`${styles.container} ${themeClass}`}>
        <div className={`${styles.dashboard}`}>
          <div className={`${styles.adminToolUnit}`}>
            <SurveyScreen allEmails={statistic.allUsersEmailList} subscribedEmails={statistic.allSubscribersEmailList} />
            <RemoveEmailFromList />
          </div>
        </div>
      </div>
    </div>
  )
}
