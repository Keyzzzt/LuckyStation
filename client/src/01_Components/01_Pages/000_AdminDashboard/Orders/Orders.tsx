import s from './orders.module.scss'
import { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { Message } from '../../../02_Chunks/Message/Message'
import { orderListThunk } from '../../../../03_Reducers/order/orderListReducer'
import { OrdersList } from './OrdersList'
import { BreadCrumbs } from '../../../02_Chunks/Breadcrumbs/Breadcrumbs'
import { DashboardSVG } from '../../../02_Chunks/svg/DashboardSVG'


export const Orders: FC = () => {
  const dispatch = useDispatch()
  const { orders, fail } = useTypedSelector(state => state.orderList)
  const [ordersFilter, setOrdersFilter] = useState<string>('all')
  const [ordersToRender, setOrdersToRender] = useState<any>(null)


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
      <BreadCrumbs pageTitle='Orders' breadcrumbs={['dashboard', 'orders']}/>
      <OrdersList orders={ordersToRender} setSortFilter={setOrdersFilter} />
    </div>
  )
}