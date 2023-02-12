import React, { FC } from 'react'
import s from './orders.module.scss'
import Loader from '../../../02_Chunks/Loader/Loader'
import { OrderResponseType } from '../../../../05_Types/ResponseTypes'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../02_Chunks/Button/Button'
import { parseCreatedUpdated } from '../../../../04_Utils/utils'

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
              <div>Date</div>
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
              <td>{parseCreatedUpdated(o.createdAt).date}</td>
              <td>{o.isPaid
                ? <Button title='Paid' type='button' color='success' marginTop='0' width='110px'  padding='3px'/>
                : <Button title='Not paid' type='button' color='danger' marginTop='0' width='110px'  padding='3px'/>
              }
              </td>
              <td>
                {o.isDelivered
                  ? <Button title='Delivered' type='button' color='success' marginTop='0' width='110px' padding='3px'/>
                  : <Button title='Not delivered' type='button' color='danger' marginTop='0' width='110px'  padding='3px'/>
                }
              </td>
              <td>
                {o.orderItems.length}
              </td>
              <td>
                <Button onClick={() => navigate(`/dashboard/orders/${o._id}`)} title='More info' type='button'
                        color='success' marginTop='0' width='120px'/>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
