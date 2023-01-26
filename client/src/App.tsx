import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Header } from './01_Components/02_Chunks/01_Header/Header'
import { Footer } from './01_Components/02_Chunks/Footer/Footer'
import { authenticateThunk } from './03_Reducers/user/userInfoReducer'
import { useTypedSelector } from './05_Types/01_Base'
import { publicRotes, privateRotes } from './routes'
import { configThunk } from './03_Reducers/appConfigReducer'
import { Routes, Route } from 'react-router-dom'
import { PageNotFound404 } from './01_Components/01_Pages/PageNotFound404/PageNotFound404'
import { AdminDashboard } from './01_Components/01_Pages/AdminDashboard/AdminDashboard'
import { API } from './01_Components/01_Pages/AdminDashboard/API/API'
import { Users } from './01_Components/01_Pages/AdminDashboard/UsersByAdmin/Users'
import { UserEdit } from './01_Components/01_Pages/AdminDashboard/UserEdit/UserEdit'
import { Main } from './01_Components/01_Pages/AdminDashboard/01_Main/Main'
import { Settings } from './01_Components/01_Pages/AdminDashboard/Settings/Settings'
import { OrderEdit } from './01_Components/01_Pages/AdminDashboard/OrderEdit/OrderEdit'
import { ProductEdit } from './01_Components/01_Pages/AdminDashboard/ProductEdit/ProductEdit'
import { Orders } from './01_Components/01_Pages/AdminDashboard/Orders/Orders'
import { Products } from './01_Components/01_Pages/AdminDashboard/Products/Products'
import { AddProduct } from './01_Components/01_Pages/AdminDashboard/CreateProduct/AddProduct'

export const App = () => {
  const dispatch = useDispatch()
  const { userInfo } = useTypedSelector(state => state.userInfo)
  const [isAuth, setIsAuth] = useState<boolean>(false)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  // Auth on every page refresh / start
  useEffect(() => {
    dispatch(authenticateThunk())
    dispatch(configThunk())
  }, [dispatch])

  useEffect(() => {
    setIsAdmin(userInfo?.isAdmin ? true : false)
    setIsAuth(userInfo ? true : false)
  }, [userInfo])
  return (
    <>
      <Header isAuth={isAuth} isAdmin={isAdmin}/>
      <Routes>
        <Route path='/*' element={<PageNotFound404/>}/>


        {publicRotes.map((route, i) => (
          <Route key={i} path={route.path} element={<route.component/>}/>
        ))}
        {isAuth &&
        privateRotes.map((route, i) => (
          <Route key={i} path={route.path} element={<route.component/>}/>
        ))}
        <Route path='/dashboard' element={<AdminDashboard/>}>
          <Route path='' element={<Main/>}/>
          <Route path='api' element={<API/>}/>
          <Route path='settings' element={<Settings/>}/>
          <Route path='users' element={<Users/>}/>
          <Route path='orders' element={<Orders/>}/>
          <Route path='products' element={<Products/>}/>
          <Route path='products/create' element={<AddProduct />}/>
          <Route path='users/:userId' element={<UserEdit/>}/>
          <Route path='orders/:orderId' element={<OrderEdit/>}/>
          <Route path='products/:productId' element={<ProductEdit/>}/>
        </Route>
      </Routes>
      <Footer isSubscribed={userInfo?.isSubscribed ? true : false}/>
    </>
  )
}

