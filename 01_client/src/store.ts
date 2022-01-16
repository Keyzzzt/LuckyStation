import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { cartReducer } from './03_Reducers/cart/cartReducer'
import { configReducer } from './03_Reducers/configReducer'
import { orderCreateReducer } from './03_Reducers/order/orderCreateReducer'
import { orderInfoReducer } from './03_Reducers/order/orderInfoReducer'
import { orderListReducer } from './03_Reducers/order/orderListReducer'
import { orderPayReducer } from './03_Reducers/order/orderPayReducer'
import { productDeleteReducer } from './03_Reducers/admin/productDeleteReducer'
import { productInfoReducer } from './03_Reducers/product/productInfoReducer'
import { productListReducer } from './03_Reducers/product/productListReducer'
import { myOrdersReducer } from './03_Reducers/user/myOrdersReducer'
import { userDeleteReducer } from './03_Reducers/user/userDeleteReducer'
import { userInfoReducer } from './03_Reducers/user/userInfoReducer'
import { userListReducer } from './03_Reducers/user/userListReducer'
import { userRegisterReducer } from './03_Reducers/user/userRegisterReducer'
import { userUpdateOwnProfileReducer } from './03_Reducers/user/userUpdateOwnProfileReducer'
import { updateProfileByAdminReducer } from './03_Reducers/admin/updateProfileByAdminReducer'
import { getUserReducer } from './03_Reducers/admin/getUserReducer'
import { createProductReducer } from './03_Reducers/admin/createProductReducer'
import { updateProductReducer } from './03_Reducers/admin/updateProductReducer'
import { orderManageReducer } from './03_Reducers/order/orderManageReducer'
import { productReviewReducer } from './03_Reducers/product/productReviewReducer'
import { loginReducer } from './03_Reducers/authReducer'
import { statisticReducer } from './03_Reducers/Statistic/statisticReducer'
import { createSurveyReducer } from './03_Reducers/admin/survey reducers/createSurveyReducer'
import { surveyListReducer } from './03_Reducers/admin/survey reducers/surveyListReducer'
import { deleteSurveyReducer } from './03_Reducers/admin/survey reducers/deleteSurveyReducer'
import { singleSurveyReducer } from './03_Reducers/admin/survey reducers/singleSurveyReducer'

const rootReducer = combineReducers({
  login: loginReducer,
  getUser: getUserReducer,
  userRegister: userRegisterReducer,
  userInfo: userInfoReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  updateProfileByAdmin: updateProfileByAdminReducer,
  userUpdateOwnProfile: userUpdateOwnProfileReducer,
  productInfo: productInfoReducer,
  productList: productListReducer,
  productDelete: productDeleteReducer,
  productReview: productReviewReducer,
  updateProduct: updateProductReducer,
  createProduct: createProductReducer,
  orderInfo: orderInfoReducer,
  orderList: orderListReducer,
  orderCreate: orderCreateReducer,
  orderPay: orderPayReducer,
  orderManage: orderManageReducer,
  myOrders: myOrdersReducer,
  cart: cartReducer,
  config: configReducer,
  statistic: statisticReducer,
  createSurvey: createSurveyReducer,
  surveyList: surveyListReducer,
  deleteSurvey: deleteSurveyReducer,
  singleSurvey: singleSurveyReducer,
})

// @ts-ignore
const cartItemsFromStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
// @ts-ignore
const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {}

// @ts-ignore
const paymentMethodFromStorage = localStorage.getItem('paymentMethod') ? localStorage.getItem('paymentMethod') : ''
const initialState = {
  cart: { cartItems: cartItemsFromStorage, shippingAddress: shippingAddressFromStorage, paymentMethod: paymentMethodFromStorage },
}

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
// @ts-ignore
const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(thunk)))

export type StateType = ReturnType<typeof rootReducer>
export type AppStoreType = ReturnType<typeof createStore>

export default store
