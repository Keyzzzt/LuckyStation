import { FC, useEffect } from 'react'
import s from './orderList.module.scss'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { Message } from '../../../02_Chunks/Message/Message'
import Loader from '../../../02_Chunks/Loader/Loader'
import { orderListThunk } from '../../../../03_Reducers/order/orderListReducer'
import { PageType } from '../AdminDashboard'

type Props = {
  setPage: (value: PageType) => void
  setOrderId: (userId: string) => void
}

export const OrderList: FC<Props> = ({setPage, setOrderId}) => {
  const dispatch = useDispatch()
  const { orders, fail } = useTypedSelector(state => state.orderList)

  const handleShowOrder = (orderId: string) => {
    setPage('orderEditScreen')
    setOrderId(orderId)
  }

  useEffect(() => {
    dispatch(orderListThunk(1, 100))
  }, [dispatch])

  return (
    <div className={s.orders}>
      {fail && <Message message={fail} type="fail"/>}
      {orders?.length === 0 && <Message message='You have no products yet...' type="fail"/>}
      <h2 className={s.title}>Orders</h2>
      <div className={s.list}>
        {!orders ? (
          <Loader/>
        ) : (
          orders.map(o => (
            <div onClick={() => handleShowOrder(o._id)} key={o._id} className={s.listItem}>
                {o._id}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
