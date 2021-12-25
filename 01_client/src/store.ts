import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { authReducer } from './03_Reducers/authReducer'
import { cartReducer } from './03_Reducers/cart/cartReducer'
import { configReducer } from './03_Reducers/configReducer'
import { orderInfoReducer } from './03_Reducers/order/orderInfoReducer'
import { orderListReducer } from './03_Reducers/order/orderListReducer'
import { productDeleteReducer } from './03_Reducers/product/productDeleteReducer'
import { productInfoReducer } from './03_Reducers/product/productInfoReducer'
import { productListReducer } from './03_Reducers/product/productListReducer'
import { userDeleteReducer } from './03_Reducers/user/userDeleteReducer'
import { userInfoReducer } from './03_Reducers/user/userInfoReducer'
import { userListReducer } from './03_Reducers/user/userListReducer'
import { userLogoutReducer } from './03_Reducers/user/userLogoutReducer'
import { userRegisterReducer } from './03_Reducers/user/userRegisterReducer'
import { userUpdateProfileByAdminReducer } from './03_Reducers/user/userUpdateProfileByAdmin'

const rootReducer = combineReducers({
  auth: authReducer,
  userRegister: userRegisterReducer,
  userInfo: userInfoReducer,
  userList: userListReducer,
  userLogout: userLogoutReducer,
  userDelete: userDeleteReducer,
  userUpdateProfileByAdmin: userUpdateProfileByAdminReducer,
  productInfo: productInfoReducer,
  productList: productListReducer,
  productDelete: productDeleteReducer,
  orderInfo: orderInfoReducer,
  orderList: orderListReducer,
  cart: cartReducer,
  config: configReducer,
})

// @ts-ignore
const cartItemsFromStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
const initialState = {
  cart: { cartItems: cartItemsFromStorage },
}

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
// @ts-ignore
const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(thunk)))

export type StateType = ReturnType<typeof rootReducer>
export type AppStoreType = ReturnType<typeof createStore>

export default store
