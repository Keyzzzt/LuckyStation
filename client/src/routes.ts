import { AdminDashboard } from './01_Components/01_Pages/AdminDashboard/AdminDashboard'
import { CreateProduct } from './01_Components/01_Pages/AdminDashboard/CreateProduct/CreateProduct'
import { CreateSurvey } from './01_Components/01_Pages/AdminDashboard/Survey/CreateSurvey/CreateSurvey'
import { SurveyPage } from './01_Components/01_Pages/AdminDashboard/Survey/SurveyPage/SurveyPage'
import { UsersList } from './01_Components/01_Pages/AdminDashboard/UsersByAdmin/UsersList'
import { LandingPage } from './01_Components/01_Pages/01_LandingPage/LandingPage'
import { ProductScreen } from './01_Components/01_Pages/SingleProductPage/SingleProductPage'
import { ProfileScreen } from './01_Components/01_Pages/ProfileScreen/ProfileScreen'
import { Ulbi } from './01_Components/01_Pages/Ulbi/Ulbi'
import { Login } from './01_Components/02_Chunks/Auth/Login'
import { Register } from './01_Components/02_Chunks/Auth/Register'
import { RestorePassword } from './01_Components/02_Chunks/Auth/RestorePassword'
import { ProductsByAdmin } from './01_Components/01_Pages/AdminDashboard/ProductsByAdmin/ProductsByAdmin'
import { OrderList } from './01_Components/01_Pages/AdminDashboard/OrderList/OrderList'
import { API } from './01_Components/01_Pages/AdminDashboard/API/API'
import { Cart } from './01_Components/01_Pages/Cart/Cart'
import { TermsAndConditions } from './01_Components/01_Pages/TermsAndConditions/TermsAndConditions'
import { ShippingPage } from './01_Components/01_Pages/ShippingPage/ShippingPage'
import { PaymentPage } from './01_Components/01_Pages/PaymentPage/PaymentPage'

export const publicRotes = [
  { path: '/restore/:token', component: RestorePassword },
  { path: '/', component: LandingPage, exact: true },
  { path: '/login', component: Login, exact: true },
  { path: '/ulbi', component: Ulbi, exact: true },
  { path: '/register', component: Register, exact: true },
  { path: '/shipping', component: ShippingPage, exact: true },
  { path: '/product/:productId', component: ProductScreen, exact: true },
  { path: '/cart/:productId?', component: Cart },
  { path: '/payment/:orderId', component: PaymentPage, exact: true },
  { path: '/terms', component: TermsAndConditions },
]
export const privateRotes = [{ path: '/profile', component: ProfileScreen, exact: true }]
export const adminRoutes = [
  { path: '/dashboard', component: AdminDashboard, exact: true },
  { path: '/dashboard/create', component: CreateProduct, exact: true },
  { path: '/survey/:surveyId', component: SurveyPage, exact: true },
  { path: '/dashboard/survey/new', component: CreateSurvey, exact: true },
  // Temp routes
  { path: '/dashboard/users', component: UsersList, exact: true },
  { path: '/dashboard/products', component: ProductsByAdmin, exact: true },
  { path: '/dashboard/orders', component: OrderList, exact: true },
  { path: '/dashboard/api', component: API, exact: true },
]
