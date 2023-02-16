import s from './orders.module.scss'
import { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { Message } from '../../../02_Chunks/Message/Message'
import { orderListTC } from '../../../../03_Reducers/order/ordersListReducer'
import { OrdersList } from './OrdersList'
import { BreadCrumbs } from '../../../02_Chunks/Breadcrumbs/Breadcrumbs'


export const Orders: FC = () => {
  const dispatch = useDispatch()
  const { orders, fail } = useTypedSelector(state => state.orderList)
  const [ordersFilter, setOrdersFilter] = useState<string>('all')
  const [ordersToRender, setOrdersToRender] = useState<any>(null)


  useEffect(() => {
    dispatch(orderListTC(1, 100))
  }, [])

  useEffect(() => {
    if (orders) setOrdersToRender(orders)
  }, [orders])

  useEffect(() => {
    if (orders) {
      switch (ordersFilter) {
        case 'dateAZ':
          return setOrdersToRender([...orders].sort((a, b) => a.createdAt.localeCompare(b.createdAt)))
        case 'dateZA':
          return setOrdersToRender([...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
        case 'paymentAZ':
          return setOrdersToRender([...orders].sort((a, b) => a.isPaid.toString().localeCompare(b.isPaid.toString())))
        case 'paymentZA':
          return setOrdersToRender([...orders].sort((a, b) => b.isPaid.toString().localeCompare(a.isPaid.toString())))
        case 'shippingAZ':
          return setOrdersToRender([...orders].sort((a, b) => a.isDelivered.toString().localeCompare(b.isDelivered.toString())))
        case 'shippingZA':
          return setOrdersToRender([...orders].sort((a, b) => b.isDelivered.toString().localeCompare(a.isDelivered.toString())))
        case 'itemsAZ':
          return setOrdersToRender([...orders].sort((a, b) => a.orderItems.length - b.orderItems.length))
        case 'itemsZA':
          return setOrdersToRender([...orders].sort((a, b) => b.orderItems.length - a.orderItems.length))
        case 'all':
          return setOrdersToRender([...orders])
      }
    }
  }, [ordersFilter])


  return (
    <div className={s.container}>
      {fail && <Message message={fail} type="fail"/>}
      {orders?.length === 0 && <Message message='You have no orders yet...' type="fail"/>}
      {orders && (
        <>
          <BreadCrumbs pageTitle='Orders' listCount={orders.length} breadcrumbs={['dashboard', 'orders']}/>
          <OrdersList orders={ordersToRender} setSortFilter={setOrdersFilter}/>
        </>
      )}
    </div>
  )
}