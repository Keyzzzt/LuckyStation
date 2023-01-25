/* eslint-disable react-hooks/exhaustive-deps */
/**
 * * Desc - admin dashboard
 * * Access - ADMIN
 * * Props - null
 * * Components to render -
 * ? TODO - page with menu and sidebar with selected page
 * ? TODO - fetch statistic to send different parts of it to different components
 * ! FIXME page with menu and sidebar with selected page
 */

import s from './AdminDashboard.module.scss'
import globalStyles from './../../../02_Styles/global.module.scss'
import React, { FC, useEffect, useState } from 'react'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { useScrollToTop } from '../../../04_Utils/hooks'
import { RemoveEmailFromList } from './RemoveEmailFromList/RemoveEmailFromList'
import { statisticThunk } from '../../../03_Reducers/Statistic/statisticReducer'
import { useDispatch } from 'react-redux'
import { CreateSurvey } from './Survey/CreateSurvey/CreateSurvey'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { CreateProduct } from './CreateProduct/CreateProduct'
import { Main } from './01_Main/Main'
import { ProductsByAdmin } from './ProductsByAdmin/ProductsByAdmin'
import { UsersList } from './UsersByAdmin/UsersList'
import { OrderList } from './OrderList/OrderList'
import { API } from './API/API'
import { ProductEditScreen } from './ProductEditScreen/ProductEditScreen'
import { OrderEditScreen } from './OrderEditScreen/OrderEditScreen'
import { UsersByAdmin } from './UsersByAdmin/UsersByAdmin'
import { UserEdit } from './UsersList/UserEdit'

export type PageType =
  'main'
  | 'createProduct'
  | 'productsList'
  | 'usersList'
  | 'ordersList'
  | 'api'
  | 'userEdit'
  | 'productEdit'
  | 'orderEditScreen'

export type SortFilterType =
  'all'
  | 'byPriceAscending'
  | 'byPriceDescending'
  | 'byDateAscending'
  | 'byDateDescending'
  | 'byName'


export const AdminDashboard: FC = () => {
  // const { statistic } = useTypedSelector(state => state.statistic)
  const [page, setPage] = useState<PageType>('main')
  const [userId, setUserId] = useState<string>('')
  const [productId, setProductId] = useState<string>('')
  const [orderId, setOrderId] = useState<string>('')

  const dispatch = useDispatch()
  useScrollToTop()

  useEffect(() => {
    dispatch(statisticThunk())
  }, [])

  const onClickHandlerCreator = (value: PageType) => {
    return () => setPage(value)
  }
  const renderContent = () => {
    switch (page) {
      case 'createProduct':
        return <CreateProduct/>
      case 'productsList':
        return <ProductsByAdmin setProductId={setProductId} setPage={setPage}/>
      case 'productEdit':
        return <ProductEditScreen productId={productId} setPage={setPage} setUserId={setUserId}/>
      case 'userEdit':
        return <UserEdit userId={userId} />
      case 'usersList':
        return <UsersByAdmin setPage={setPage} setUserId={setUserId}/>
      case 'ordersList':
        return <OrderList setPage={setPage} setOrderId={setOrderId}/>
      case 'orderEditScreen':
        return <OrderEditScreen orderId={orderId}/>
      case 'api':
        return <API/>

      default:
        return <Main/>
    }
  }
  return (
    <div className={s.container}>
      <nav className={s.navbar}>
        <ul className={s.navbarMenu}>
          <li onClick={onClickHandlerCreator('main')} className={s.luckyStation}>Lucky Station</li>
          <li onClick={onClickHandlerCreator('createProduct')} className={s.menuItem}>Create Product</li>
          <li onClick={onClickHandlerCreator('productsList')} className={s.menuItem}>Products list</li>
          <li onClick={onClickHandlerCreator('usersList')} className={s.menuItem}>Users list</li>
          <li onClick={onClickHandlerCreator('ordersList')} className={s.menuItem}>Orders list</li>
          <li onClick={onClickHandlerCreator('api')} className={s.menuItem}>API</li>
        </ul>
      </nav>
      <div className={s.content}>
        {renderContent()}
      </div>
    </div>
  )
}
