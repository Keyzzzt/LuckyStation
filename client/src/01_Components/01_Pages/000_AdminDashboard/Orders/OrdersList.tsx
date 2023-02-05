import { FC } from 'react'
import s from './orders.module.scss'
import Loader from '../../../02_Chunks/Loader/Loader'
import { OrderResponseType } from '../../../../05_Types/ResponseTypes'
import { useNavigate } from 'react-router-dom'

type Props = {
  orders: OrderResponseType[]
  setSortFilter: (filter: string) => void
}

export const OrdersList: FC<Props> = ({ orders }) => {
  const navigate = useNavigate()

  return (
    <div className={s.list}>
      {!orders ? (
        <Loader/>
      ) : (
        <table className='stationTable'>
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
              <td>{o.isPaid ? <div className='success'>Paid</div> :
                <div className='danger'>Unpaid</div>}
                <span className={s.paymentMethod}>{o.paymentMethod}</span>
              </td>
              <td>
                {o.isDelivered ? <div className='success'>Delivered</div> :
                  <div className='danger'>Not delivered</div>}
              </td>
              <td>
                {o.orderItems.length}
              </td>
              <button onClick={() => navigate(`/dashboard/orders/${o._id}`)} className='success'>More info</button>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
