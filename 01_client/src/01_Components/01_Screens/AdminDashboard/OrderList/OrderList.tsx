import { FC, useEffect } from 'react'
import styles from './OrderList.module.scss'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { ErrorMessage } from '../../../02_Chunks/ErrorMessage/ErrorMessage'
import Loader from '../../../02_Chunks/Loader/Loader'
import { Link } from 'react-router-dom'
import { productListThunk } from '../../../../03_Reducers/product/productListReducer'
import { actions } from '../../../../03_Reducers/product/productInfoReducer'
import { orderListThunk } from '../../../../03_Reducers/order/orderListReducer'
const { v4: uuidv4 } = require('uuid')

export const OrderList: FC = () => {
  const dispatch = useDispatch()
  const { config } = useTypedSelector((state) => state)
  const { orders, loading, error } = useTypedSelector((state) => state.orderList)
  const themeClass = config.colorTheme === 'light' ? styles.light_mode : styles.dark_mode

  useEffect(() => {
    dispatch(orderListThunk(1, 100))
  }, [dispatch])
  return (
    <div className={`${styles.customerslist} ${themeClass}`}>
      {error && <ErrorMessage message={error} />}
      {loading && <Loader />}
      <div className={styles.customerslist__header}>
        <h2 className={`${styles.customerslist__header__title} ${themeClass}`}>Orders</h2>
      </div>

      <div className={styles.list}>
        {orders?.map((order) => (
          <div key={uuidv4()} className={styles.list__item}>
            <div className={styles.info}>
              <Link to={`/order/${order._id}/edit`} className={`${styles.name} ${themeClass}`}>
                {order._id}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
