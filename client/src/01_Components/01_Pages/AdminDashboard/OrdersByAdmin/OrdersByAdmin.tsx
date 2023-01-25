import s from './ordersByAdmin.module.scss'
import globalStyles from './../../../../02_Styles/global.module.scss'
import { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { Message } from '../../../02_Chunks/Message/Message'
import { PageType } from '../AdminDashboard'
import { orderListThunk } from '../../../../03_Reducers/order/orderListReducer'
import { OrderList } from './OrderList'


type Props = {
  setPage: (page: PageType) => void
  setOrderId: (orderId: string) => void
}

export const OrdersByAdmin: FC<Props> = ({ setPage, setOrderId }) => {
  const dispatch = useDispatch()
  const { orders, fail } = useTypedSelector(state => state.orderList)
  const [ordersFilter, setOrdersFilter] = useState<string>('all')
  const [ordersToRender, setOrdersToRender] = useState<any>(null)

  // useEffect(() => {
  //   dispatch(usersListThunk(1, 10))
  // }, [dispatch, deleteSuccess])
  useEffect(() => {
    dispatch(orderListThunk(1, 100))
  }, [])

  useEffect(() => {
    if (orders) setOrdersToRender(orders)
  }, [orders])

  useEffect(() => {
    if (orders) {
      switch (ordersFilter) {
        // case 'nameAZ':
        //   return setProductsToRender([...users].sort((a, b) => a.name.localeCompare(b.name)))
        // case 'nameZA':
        //   return setProductsToRender([...users].sort((a, b) => b.name.localeCompare(a.name)))
        // case 'categoryAZ':
        //   return setProductsToRender([...users].sort((a, b) => a.category.localeCompare(b.category)))
        // case 'categoryZA':
        //   return setProductsToRender([...users].sort((a, b) => b.category.localeCompare(a.category)))
        // case 'brandAZ':
        //   return setProductsToRender([...users].sort((a, b) => a.brand.localeCompare(b.brand)))
        // case 'brandZA':
        //   return setProductsToRender([...users].sort((a, b) => b.brand.localeCompare(a.brand)))
        // case 'inStockAZ':
        //   return setProductsToRender([...users].sort((a, b) => a.countInStock - b.countInStock))
        // case 'inStockZA':
        //   return setProductsToRender([...users].sort((a, b) => b.countInStock - a.countInStock))
        // case 'lowestPriceFirst':
        //   return setProductsToRender([...users].sort((a, b) => a.price - b.price))
        // case 'highestPriceFirst':
        //   return setProductsToRender([...users].sort((a, b) => b.price - a.price))
        case 'all':
          return setOrdersToRender([...orders])
      }
    }
  }, [ordersFilter])


  return (
    <div className={s.container}>
      {fail && <Message message={fail} type="fail"/>}
      {orders?.length === 0 && <Message message='You have no orders yet...' type="fail"/>}
      <div className={s.header}>
        <h2 className={s.title}>Orders</h2>
      </div>
      <OrderList orders={ordersToRender} setSortFilter={setOrdersFilter} setPage={setPage} setOrderId={setOrderId}/>
    </div>
  )
}