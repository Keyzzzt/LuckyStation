import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Header } from './01_Components/01_Pages/01_LandingPage/01_Header/Header'
import { Footer } from './01_Components/02_Chunks/Footer/Footer'
import { authenticateThunk } from './03_Reducers/user/userInfoReducer'
import { useTypedSelector } from './05_Types/01_Base'
import { configThunk } from './03_Reducers/appConfigReducer'
import { Routes, Route } from 'react-router-dom'
import { Page404 } from './01_Components/01_Pages/PageNotFound404/Page404'
import { AdminDashboard } from './01_Components/01_Pages/000_AdminDashboard/AdminDashboard'
import { API } from './01_Components/01_Pages/000_AdminDashboard/API/API'
import { Users } from './01_Components/01_Pages/000_AdminDashboard/Users/Users'
import { UserEdit } from './01_Components/01_Pages/000_AdminDashboard/UserEdit/UserEdit'
import { Main } from './01_Components/01_Pages/000_AdminDashboard/01_Main/Main'
import { Settings } from './01_Components/01_Pages/000_AdminDashboard/Settings/Settings'
import { OrderEdit } from './01_Components/01_Pages/000_AdminDashboard/OrderEdit/OrderEdit'
import { ProductEdit } from './01_Components/01_Pages/000_AdminDashboard/ProductEdit/ProductEdit'
import { Orders } from './01_Components/01_Pages/000_AdminDashboard/Orders/Orders'
import { Products } from './01_Components/01_Pages/000_AdminDashboard/Products/Products'
import { AddProduct } from './01_Components/01_Pages/000_AdminDashboard/AddProduct/AddProduct'
import { SignInPage } from './01_Components/01_Pages/Auth/SignInPage'
import { LandingPage } from './01_Components/01_Pages/01_LandingPage/LandingPage'
import { ShippingPage } from './01_Components/01_Pages/ShippingPage/ShippingPage'
import { ProductScreen } from './01_Components/01_Pages/SingleProductPage/SingleProductPage'
import { CartPage } from './01_Components/01_Pages/CartPage/CartPage'
import { PaymentPage } from './01_Components/01_Pages/PaymentPage/PaymentPage'
import { TermsAndConditionsPage } from './01_Components/01_Pages/TermsAndConditionsPage/TermsAndConditionsPage'
import { ProfilePage } from './01_Components/01_Pages/ProfilePage/ProfilePage'
import { SignUpPage } from './01_Components/01_Pages/Auth/SignUpPage'
import { PasswordRecovery } from './01_Components/01_Pages/Auth/PasswordRecovery'
import { Gallery } from './01_Components/01_Pages/GalleryPage/Gallery'
import { GalleryAdmin } from './01_Components/01_Pages/000_AdminDashboard/GalleryAdmin/GalleryAdmin'
import { galleryListThunk } from './03_Reducers/galleryReducer'

export const App = () => {
  console.log('APP')
  const dispatch = useDispatch()
  const { userInfo } = useTypedSelector(state => state.userInfo)
  const { companyName, aboutSectionParagraphs} = useTypedSelector(state => state.appConfig.config)
  const { gallery} = useTypedSelector(state => state)
  const [isAuth, setIsAuth] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  // Auth on every page refresh / start
  useEffect(() => {
    console.log('APP: authenticate')
    dispatch(galleryListThunk())
    dispatch(authenticateThunk())
    dispatch(configThunk())
  }, [])

  useEffect(() => {
    if(userInfo){
      console.log('APP: userInfo changed!')
      setIsAdmin(userInfo.isAdmin)
      setIsAuth(true)
    }
  }, [userInfo])
  const header = <Route path='/' element={<Header isAuth={isAuth} isAdmin={isAdmin}/>}/>
  return (
    <>
      <Routes>
        {/*Public*/}
        <Route path='/*' element={<Page404 companyName={companyName}/>}/>
        <Route path='/' element={<LandingPage companyName={companyName} aboutSectionParagraphs={aboutSectionParagraphs} />}>
          {header}
        </Route>
        <Route path='/signup' element={<SignUpPage/>}/>
        <Route path='/gallery' element={<Gallery items={gallery.galleryListItems} item={gallery.item}/>}/>
        <Route path={'/signin'} element={<SignInPage/>}/>
        <Route path={'/recovery'} element={<PasswordRecovery/>}/>
        <Route path='/shipping' element={<ShippingPage/>}/>
        <Route path='/product/:productId' element={<ProductScreen/>}/>
        <Route path='/cart/:productId?' element={<CartPage/>}/>
        <Route path='/payment/:orderId' element={<PaymentPage/>}/>
        <Route path='/terms' element={<TermsAndConditionsPage/>}/>
        {/*Private*/}
        <Route path='/profile' element={<ProfilePage/>}/>
        {/*Admin*/}
        <Route path='/dashboard' element={<AdminDashboard/>}>
          <Route path='' element={<Main/>}/>
          <Route path='api' element={<API/>}/>
          <Route path='settings' element={<Settings/>}/>
          <Route path='users' element={<Users/>}/>
          <Route path='orders' element={<Orders/>}/>
          <Route path='gallery' element={<GalleryAdmin />}/>
          <Route path='products' element={<Products/>}/>
          <Route path='products/add' element={<AddProduct/>}/>
          <Route path='users/:userId' element={<UserEdit/>}/>
          <Route path='orders/:orderId' element={<OrderEdit/>}/>
          <Route path='products/:productId' element={<ProductEdit/>}/>
        </Route>
      </Routes>
      <Footer isSubscribed={!!userInfo?.isSubscribed}/>
    </>
  )
}

