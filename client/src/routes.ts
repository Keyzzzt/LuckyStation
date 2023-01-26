import { LandingPage } from './01_Components/01_Pages/01_LandingPage/LandingPage'
import { ProductScreen } from './01_Components/01_Pages/SingleProductPage/SingleProductPage'
import { ProfileScreen } from './01_Components/01_Pages/ProfileScreen/ProfileScreen'
import { Login } from './01_Components/02_Chunks/Auth/Login'
import { Register } from './01_Components/02_Chunks/Auth/Register'
import { RestorePassword } from './01_Components/02_Chunks/Auth/RestorePassword'
import { Cart } from './01_Components/01_Pages/Cart/Cart'
import { TermsAndConditions } from './01_Components/01_Pages/TermsAndConditions/TermsAndConditions'
import { ShippingPage } from './01_Components/01_Pages/ShippingPage/ShippingPage'
import { PaymentPage } from './01_Components/01_Pages/PaymentPage/PaymentPage'

export const publicRotes = [
  { path: '/restore/:token', component: RestorePassword },
  { path: '/', component: LandingPage },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/shipping', component: ShippingPage },
  { path: '/product/:productId', component: ProductScreen },
  { path: '/cart/:productId?', component: Cart },
  { path: '/payment/:orderId', component: PaymentPage },
  { path: '/terms', component: TermsAndConditions },
]
export const privateRotes = [{ path: '/profile', component: ProfileScreen }]