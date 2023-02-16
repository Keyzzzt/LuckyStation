import React, { FC, useState } from 'react'
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
type OrdersFilterType = 'date' | 'payment' | 'shipping' | 'items'

export const OrdersList: FC<Props> = ({ orders, setSortFilter }) => {

  const [sortByDate, setSortByDate] = useState(false)
  const [sortByPayment, setSortByPayment] = useState(false)
  const [sortByShipping, setSortByShipping] = useState(false)
  const [sortByItemsCount, setSortByItemsCount] = useState(false)
  const navigate = useNavigate()

  const handleFilter = (filter: OrdersFilterType) => {
    switch (filter) {
      case 'date':
        setSortByDate(!sortByDate)
        sortByDate ? setSortFilter('dateAZ') : setSortFilter('dateZA')
        break
      case 'payment':
        setSortByPayment(!sortByPayment)
        sortByPayment ? setSortFilter('paymentAZ') : setSortFilter('paymentZA')
        break
      case 'shipping':
        setSortByShipping(!sortByShipping)
        sortByShipping ? setSortFilter('shippingAZ') : setSortFilter('shippingZA')
        break
      case 'items':
        setSortByItemsCount(!sortByItemsCount)
        sortByItemsCount ? setSortFilter('itemsAZ') : setSortFilter('itemsZA')
        break
    }
  }
  return (
    <div className={s.list}>
      {!orders ? (
        <Loader/>
      ) : (
        <table className='stationTable'>
          <thead>
          <tr>
            <th>
              <div onClick={() => handleFilter('date')}>Date {sortByDate
                ? <i className="fa-sharp fa-solid fa-caret-up"/>
                : <i className="fa-sharp fa-solid fa-caret-down"/>}
              </div>
            </th>
            <th>
              <div onClick={() => handleFilter('payment')}>Payment {sortByDate
                ? <i className="fa-sharp fa-solid fa-caret-up"/>
                : <i className="fa-sharp fa-solid fa-caret-down"/>}
              </div>
            </th>
            <th>
              <div onClick={() => handleFilter('shipping')}>Shipping {sortByDate
                ? <i className="fa-sharp fa-solid fa-caret-up"/>
                : <i className="fa-sharp fa-solid fa-caret-down"/>}
              </div>
            </th>
            <th>
              <div onClick={() => handleFilter('items')}>Items {sortByDate
                ? <i className="fa-sharp fa-solid fa-caret-up"/>
                : <i className="fa-sharp fa-solid fa-caret-down"/>}
              </div>
            </th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          {orders.map(o => (
            <tr key={o._id}>
              <td>{parseCreatedUpdated(o.createdAt, 'date')}</td>
              <td>{o.isPaid
                ? <Button title='Paid' type='button' color='success' marginTop='0' minWidth='110px'  padding='5px'/>
                : <Button title='Not paid' type='button' color='danger' marginTop='0' minWidth='110px'  padding='5px'/>
              }
              </td>
              <td>
                {o.isDelivered
                  ? <Button title='Delivered' type='button' color='success' marginTop='0' minWidth='110px' padding='5px'/>
                  : <Button title='Not delivered' type='button' color='danger' marginTop='0' minWidth='110px'  padding='5px'/>
                }
              </td>
              <td>
                {o.orderItems.length}
              </td>
              <td>
                <Button onClick={() => navigate(`/dashboard/orders/${o._id}`)} title='More info' type='button'
                        color='success' marginTop='0' minWidth='110px'/>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
