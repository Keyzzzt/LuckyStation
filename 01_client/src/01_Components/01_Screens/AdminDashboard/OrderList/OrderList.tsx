import { FC, useEffect } from 'react'
import styles from './OrderList.module.scss'
import { useHistory } from 'react-router'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { ErrorMessage } from '../../../02_Chunks/ErrorMessage/ErrorMessage'
import Loader from '../../../02_Chunks/Loader/Loader'
import { Link } from 'react-router-dom'
import { orderListThunk } from '../../../../03_Reducers/order/orderListReducer'
import { useIsAdminRedirect } from '../../../../04_Utils/hooks'
import { getRandom } from '../../../../04_Utils/utils'

export const OrderList: FC = () => {
  const { userInfo } = useTypedSelector((state) => state.userInfo)
  const history = useHistory()
  useIsAdminRedirect(userInfo, history)

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
          <div key={getRandom()} className={styles.list__item}>
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
