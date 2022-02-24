import styles from './OrderList.module.scss'
import { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { Message } from '../../../02_Chunks/Message/Message'
import Loader from '../../../02_Chunks/Loader/Loader'
import { Link } from 'react-router-dom'
import { orderListThunk } from '../../../../03_Reducers/order/orderListReducer'
import { getRandom } from '../../../../04_Utils/utils'

export const OrderList: FC = () => {
  const dispatch = useDispatch()
  const { colorTheme } = useTypedSelector(state => state)
  const { orders, fail } = useTypedSelector(state => state.orderList)
  // @ts-ignore
  const themeClass = colorTheme === 'light' ? styles.light_mode : styles.dark_mode

  useEffect(() => {
    dispatch(orderListThunk(1, 100))
  }, [dispatch])
  return (
    <div className={`${styles.customerslist} ${themeClass}`}>
      {fail && <Message message={fail} type="fail" />}
      <div className={styles.customerslist__header}>
        <h2 className={`${styles.customerslist__header__title} ${themeClass}`}>Orders</h2>
      </div>

      <div className={styles.list}>
        {!orders ? (
          <Loader />
        ) : (
          orders.map(order => (
            <div key={getRandom()} className={styles.list__item}>
              <div className={styles.info}>
                <Link to={`/order/${order._id}/edit`} className={`${styles.name} ${themeClass}`}>
                  {order._id}
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
