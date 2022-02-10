import { AdminDashboard } from './01_Components/01_Screens/AdminDashboard/AdminDashboard'
import { OrderEditScreen } from './01_Components/01_Screens/AdminDashboard/OrderEditScreen/OrderEditScreen'
import { CreateProductPage } from './01_Components/01_Screens/AdminDashboard/CreateProductPage/CreateProductPage'
import { ProductEditScreen } from './01_Components/01_Screens/AdminDashboard/ProductEditScreen/ProductEditScreen'
import { CreateSurvey } from './01_Components/01_Screens/AdminDashboard/Survey/CreateSurvey/CreateSurvey'
import { SurveyPage } from './01_Components/01_Screens/AdminDashboard/Survey/SurveyPage/SurveyPage'
import { UserEditScreen } from './01_Components/01_Screens/AdminDashboard/UserEditScreen/UserEditScreen'
import { UsersList } from './01_Components/01_Screens/AdminDashboard/UsersList/UsersList'
import { CartScreen } from './01_Components/01_Screens/CartScreen/CartScreen'
import { Home } from './01_Components/01_Screens/Home/Home'
import { OrderScreen } from './01_Components/01_Screens/OrderScreen/OrderScreen'
import { PaymentScreen } from './01_Components/01_Screens/PaymentScreen/PaymentScreen'
import { PlaceOrderScreen } from './01_Components/01_Screens/PlaceOrderScreen/PlaceOrderScreen'
import { ProductScreen } from './01_Components/01_Screens/ProductScreen/ProductScreen'
import { ProfileScreen } from './01_Components/01_Screens/ProfileScreen/ProfileScreen'
import { ShippingScreen } from './01_Components/01_Screens/ShippingScreen/ShippingScreen'
import { Ulbi } from './01_Components/01_Screens/Ulbi/Ulbi'
import { Login } from './01_Components/02_Chunks/Auth/Login'
import { Register } from './01_Components/02_Chunks/Auth/Register'
import { RestorePassword } from './01_Components/02_Chunks/Auth/RestorePassword'
import { ProductsList } from './01_Components/01_Screens/AdminDashboard/ProductsList/ProductsList'
import { OrderList } from './01_Components/01_Screens/AdminDashboard/OrderList/OrderList'

export const publicRotes = [
  { path: '/restore/:token', component: RestorePassword },
  { path: '/', component: Home, exact: true },
  { path: '/login', component: Login, exact: true },
  { path: '/ulbi', component: Ulbi, exact: true },
  { path: '/register', component: Register, exact: true },
  { path: '/shipping', component: ShippingScreen, exact: true },
  { path: '/payment', component: PaymentScreen, exact: true },
  { path: '/placeorder', component: PlaceOrderScreen, exact: true },
  { path: '/product/:productId', component: ProductScreen, exact: true },
  { path: '/cart/:productId', component: CartScreen },
]
export const privateRotes = [
  { path: '/profile', component: ProfileScreen, exact: true },
  { path: '/order/:orderId', component: OrderScreen, exact: true },
]
export const adminRoutes = [
  { path: '/dashboard', component: AdminDashboard, exact: true },
  { path: '/product/:productId/edit', component: ProductEditScreen, exact: true },
  { path: '/user/:userId/edit', component: UserEditScreen, exact: true },
  { path: '/order/:orderId/edit', component: OrderEditScreen, exact: true },
  { path: '/dashboard/create', component: CreateProductPage, exact: true },
  { path: '/survey/:surveyId', component: SurveyPage, exact: true },
  { path: '/dashboard/survey/new', component: CreateSurvey, exact: true },
  // Temp routes
  { path: '/dashboard/users', component: UsersList, exact: true },
  { path: '/dashboard/products', component: ProductsList, exact: true },
  { path: '/dashboard/orders', component: OrderList, exact: true },
]
