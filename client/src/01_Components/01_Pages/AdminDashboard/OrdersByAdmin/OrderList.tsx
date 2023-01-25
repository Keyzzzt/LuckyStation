import { FC } from 'react'
import s from './ordersByAdmin.module.scss'
import { Message } from '../../../02_Chunks/Message/Message'
import Loader from '../../../02_Chunks/Loader/Loader'
import { PageType } from '../AdminDashboard'
import { OrderFromAPI } from '../../../../05_Types/APIResponse'
import globalStyles from '../../../../02_Styles/global.module.scss'

type Props = {
  setPage: (value: PageType) => void
  setOrderId: (userId: string) => void
  orders: OrderFromAPI[]
  setSortFilter: (filter: string) => void
}

export const OrderList: FC<Props> = ({ setPage, setOrderId, orders }) => {

  const handleShowOrder = (orderId: string) => {
    setPage('orderEditScreen')
    setOrderId(orderId)
  }

  return (

    <div className={s.list}>
      {!orders ? (
        <Loader/>
      ) : (
        <table className={globalStyles.table}>
          <thead>
          <tr>
            <th>
              <div>ID</div>
            </th>
            <th>
              <div>Payment</div>
            </th>
            <th>
              <div>Shipping</div>
            </th>
            <th>
              <div>Items</div>
            </th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          {orders.map(o => (
            <tr key={o._id}>
              <td>{o._id}</td>
              <td>{o.isPaid ? <div className={globalStyles.success}>Paid</div> :
                <div className={globalStyles.danger}>Unpaid</div>}
                <span className={s.paymentMethod}>{o.paymentMethod}</span>
              </td>
              <td>
                {o.isDelivered ? <div className={globalStyles.success}>Delivered</div> :
                  <div className={globalStyles.danger}>Not delivered</div>}
              </td>
              <td>
                {o.orderItems.length}
              </td>
              <button onClick={() => handleShowOrder(o._id)} className={globalStyles.success}>More info</button>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
