import { useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Home } from './01_Components/01_Screens/Home/Home'
import { Login } from './01_Components/01_Screens/Login/Login'
import { CartScreen } from './01_Components/01_Screens/CartScreen/CartScreen'
import { Register } from './01_Components/01_Screens/Register/Register'
import { AdminDashboard } from './01_Components/01_Screens/AdminDashboard/AdminDashboard'
import { Header } from './01_Components/02_Chunks/Header/Header'
import { Footer } from './01_Components/02_Chunks/Footer/Footer'
import { ProductScreen } from './01_Components/01_Screens/ProductScreen/ProductScreen'
import { ProfileScreen } from './01_Components/01_Screens/ProfileScreen/ProfileScreen'
import { authenticateThunk } from './03_Reducers/user/userInfoReducer'
import { ShippingScreen } from './01_Components/01_Screens/ShippingScreen/ShippingScreen'
import { PaymentScreen } from './01_Components/01_Screens/PaymentScreen/PaymentScreen'
import { PlaceOrderScreen } from './01_Components/01_Screens/PlaceOrderScreen/PlaceOrderScreen'
import { OrderScreen } from './01_Components/01_Screens/OrderScreen/OrderScreen'
import { UserEditScreen } from './01_Components/01_Screens/UserEditScreen/UserEditScreen'
import { ProductEditScreen } from './01_Components/01_Screens/AdminDashboard/ProductEditScreen/ProductEditScreen'
import { OrderEditScreen } from './01_Components/01_Screens/AdminDashboard/OrderEditScreen/OrderEditScreen'
import { ProductCreateScreen } from './01_Components/01_Screens/AdminDashboard/ProductCreateScreen/ProductCreateScreen'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(authenticateThunk())
  }, [dispatch])
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/" render={() => <Home />} />
        <Route path="/login" render={() => <Login />} />
        <Route path="/profile" render={() => <ProfileScreen />} />
        <Route path="/cart/:productId?" render={() => <CartScreen />} />
        <Route path="/register" render={() => <Register />} />
        <Route path="/dashboard" render={() => <AdminDashboard />} />
        <Route path="/product/:productId" render={() => <ProductScreen />} exact />
        <Route path="/shipping" render={() => <ShippingScreen />} />
        <Route path="/payment" render={() => <PaymentScreen />} />
        <Route path="/placeorder" render={() => <PlaceOrderScreen />} />
        <Route path="/user/:userId/edit" render={() => <UserEditScreen />} exact />
        <Route path="/product/:productId/edit" render={() => <ProductEditScreen />} />
        <Route path="/order/:orderId/edit" render={() => <OrderEditScreen />} exact />
        <Route path="/create" render={() => <ProductCreateScreen />} />
        <Route path="/order/:orderId" render={() => <OrderScreen />} />
      </Switch>
      <Footer />
    </div>
  )
}

// TODO: Тест приложения при отключенном API.
// TODO: Нужно реализовать некий принцип брони, чтобы 2 покупателя не купили последний оставшийся продукт.
// TODO: https://www.udemy.com/course/mern-ecommerce/learn/lecture/22498996#questions/12904054

export default App
