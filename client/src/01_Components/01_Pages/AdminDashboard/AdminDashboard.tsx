/* eslint-disable react-hooks/exhaustive-deps */
import styles from './AdminDashboard.module.scss'
import { FC, useEffect } from 'react'
import { useTypedSelector } from '../../../05_Types/01_Base'
// import { UsersList } from './UsersList/UsersList'
// import { DashboardHeader } from './DashboardHeader/DashboardHeader'
// import { Earnings } from './Earnings/Earnings'
// import { ProductSales } from './ProductSales/ProductSales'
// import { Totals } from './Totals/Totals'
// import { ProductsList } from './ProductsList/ProductsList'
// import { OrderList } from './OrderList/OrderList'
import { useScrollToTop } from '../../../04_Utils/hooks'
import { RemoveEmailFromList } from './RemoveEmailFromList/RemoveEmailFromList'
import { statisticThunk } from '../../../03_Reducers/Statistic/statisticReducer'
import { useDispatch } from 'react-redux'
import { CreateSurvey } from './Survey/CreateSurvey/CreateSurvey'
import { useHistory } from 'react-router'
import { SingleProductPageSlider } from '../../02_Chunks/SingleProductPageSlider/SingleProductPageSlider'
import { images } from '../../../fakeData'

export const AdminDashboard: FC = () => {
  const { statistic } = useTypedSelector(state => state.statistic)
  const dispatch = useDispatch()
  const history = useHistory()

  useScrollToTop()
  const { colorTheme } = useTypedSelector(state => state)
  //@ts-ignore
  const themeClass = colorTheme === 'light' ? styles.light_mode : styles.dark_mode

  useEffect(() => {
    dispatch(statisticThunk())
  }, [])
  return (
    <div className={`${styles.scroll} ${themeClass}`}>
      <div className={`${styles.container} ${themeClass}`}>
        <button onClick={() => history.push('/dashboard/create')}>Create Product</button>
        <button onClick={() => history.push('/dashboard/users')}>Users list</button>
        <button onClick={() => history.push('/dashboard/products')}>Products list</button>
        <button onClick={() => history.push('/dashboard/orders')}>Orders list</button>
        <button onClick={() => history.push('/dashboard/api')}>API</button>
        <div className={`${styles.dashboard}`}>
          <div className={`${styles.adminToolUnit}`}>
            <CreateSurvey
              allEmails={statistic.allUsersEmailList}
              subscribedEmails={statistic.allSubscribersEmailList}
            />
            <RemoveEmailFromList />
            <SingleProductPageSlider images={images} />
          </div>
        </div>
      </div>
    </div>
  )
}
