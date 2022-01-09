import { useEffect } from 'react'
import { Redirect, Switch, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Home } from './01_Components/01_Screens/Home/Home'
import { CartScreen } from './01_Components/01_Screens/CartScreen/CartScreen'
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
import { ProductEditScreen } from './01_Components/01_Screens/AdminDashboard/ProductEditScreen/ProductEditScreen'
import { ProductCreateScreen } from './01_Components/01_Screens/AdminDashboard/ProductCreateScreen/ProductCreateScreen'
import { OrderEditScreen } from './01_Components/01_Screens/AdminDashboard/OrderEditScreen/OrderEditScreen'
import { UserEditScreen } from './01_Components/01_Screens/AdminDashboard/UserEditScreen/UserEditScreen'
import { Login } from './01_Components/02_Chunks/Login/Login'
import { Register } from './01_Components/02_Chunks/Register/Register'
import { Ulbi } from './01_Components/01_Screens/Ulbi/Ulbi'
import { RestorePassword } from './01_Components/02_Chunks/RestorePassword/RestorePassword'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(authenticateThunk())
  }, [dispatch])
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/ulbi" render={() => <Ulbi />} />
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
        <Route path="/restore" render={() => <RestorePassword />} />
        <Route path="/order/:orderId" render={() => <OrderScreen />} />
        <Route exact path="/:keyword?/:page?/:limit?" render={() => <Home />} />
        <Route exact path="/:page/:limit" render={() => <Home />} />
        <Route exact path="/" render={() => <Home />} />
        <Redirect to="/" />
      </Switch>
      <Footer />
    </div>
  )
}

// TODO: Тест приложения при отключенном API.
// TODO: Нужно реализовать некий принцип брони, чтобы 2 покупателя не купили последний оставшийся продукт.
// TODO: https://www.udemy.com/course/mern-ecommerce/learn/lecture/22498996#questions/12904054
// TODO Попробовать реализовать useFetch хук. https://www.youtube.com/watch?v=GNrdg3PzpJQ&t=3808s 1:50
// TODO сделать роуты для админа недоступными для остальных по типу как у Ulbi https://www.youtube.com/watch?v=GNrdg3PzpJQ&t=3808s 2:33
// TODO расставить везде вопросы user?.info?.profile?.name

export default App
