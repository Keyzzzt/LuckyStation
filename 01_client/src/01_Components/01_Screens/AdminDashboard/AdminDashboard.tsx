import React, { useEffect } from 'react'
// import { useDispatch } from 'react-redux'
// import { getSingleOrderThunk } from '../../../03_Reducers/order/orderInfoReducer'
// import { orderListThunk } from '../../../03_Reducers/order/orderListReducer'
// import { productDeleteThunk } from '../../../03_Reducers/product/productDeleteReducer'
// import { productInfoThunk } from '../../../03_Reducers/product/productInfoReducer'
// import { productListThunk } from '../../../03_Reducers/product/productListReducer'
// import { userInfoThunk } from '../../../03_Reducers/user/userInfoReducer'
// import { getUsersListThunk } from '../../../03_Reducers/user/userListReducer'
// import { userDeleteThunk } from '../../../03_Reducers/user/userDeleteReducer'
// import { updateProfileByAdminThunk } from '../../../03_Reducers/user/userUpdateProfileByAdmin'
import { useTypedSelector } from '../../../05_Types/01_Base'
import styles from './AdminDashboard.module.scss'
import { CustomersList } from './CustomersList/CustomersList'
import { DashboardHeader } from './DashboardHeader/DashboardHeader'
import { Earnings } from './Earnings/Earnings'
import { ProductSales } from './ProductSales/ProductSales'
import { Totals } from './Totals/Totals'

export const AdminDashboard: React.FC = () => {
  const { config } = useTypedSelector((state) => state)
  // const dispatch = useDispatch()
  const themeClass = config.colorTheme === 'light' ? styles.light_mode : styles.dark_mode

  useEffect(() => {
    // FIXME: Два раза диспатчит
    // dispatch(getUsersListThunk(2, 1))
    // dispatch(userInfoThunk('61c0c56cb3a6ec02e7a33d56'))
    // dispatch(userDeleteThunk('61be0fc5237ac8fee5c60511'))
    // dispatch(productInfoThunk('61c0cdcc055cd2d8812de17e'))
    // dispatch(productListThunk(2, 3))
    // dispatch(orderListThunk(2, 2))
    // dispatch(getSingleOrderThunk('61c0cf83055cd2d8812de1bf'))
    // dispatch(updateProfileByAdminThunk('61c0c56fb3a6ec02e7a33d5c', { isAdmin: true }))
    // dispatch(productDeleteThunk('61c0cdcb055cd2d8812de17c'))
  }, [])
  return (
    <div className={`${styles.scroll} ${themeClass}`}>
      <div className={`${styles.container} ${themeClass}`}>
        <div className={`${styles.dashboard}`}>
          <DashboardHeader />
          <Totals />
          <Earnings />
          <div className={styles.dashboard__footer}>
            <ProductSales />
            <CustomersList />
          </div>
        </div>
      </div>
    </div>
  )
}
