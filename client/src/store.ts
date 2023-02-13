import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { cartReducer } from './03_Reducers/cart/cartReducer'
import { orderCreateReducer } from './03_Reducers/order/orderCreateReducer'
import { orderInfoReducer } from './03_Reducers/order/orderInfoReducer'
import { ordersListReducer } from './03_Reducers/order/ordersListReducer'
import { orderPayReducer } from './03_Reducers/order/orderPayReducer'
import { productDeleteReducer } from './03_Reducers/admin/productDeleteReducer'
import { productInfoReducer } from './03_Reducers/product/productInfoReducer'
import { productsListReducer } from './03_Reducers/product/productsListReducer'
import { myOrdersReducer } from './03_Reducers/user/myOrdersReducer'
import { userDeleteReducer } from './03_Reducers/admin/userDeleteReducer'
import { userInfoReducer } from './03_Reducers/user/userInfoReducer'
import { usersListReducer } from './03_Reducers/admin/usersListReducer'
import { userRegisterReducer } from './03_Reducers/user/userRegisterReducer'
import { userUpdateOwnProfileReducer } from './03_Reducers/user/userUpdateOwnProfileReducer'
import { toggleAdminStatusReducer } from './03_Reducers/admin/toggleAdminStatusReducer'
import { getUserReducer } from './03_Reducers/admin/getUserReducer'
import { createProductReducer } from './03_Reducers/admin/createProductReducer'
import { updateProductReducer } from './03_Reducers/admin/updateProductReducer'
import { orderManageReducer } from './03_Reducers/order/orderManageReducer'
import { statisticReducer } from './03_Reducers/Statistic/statisticReducer'
import { apiReducer } from './03_Reducers/admin/apiReducer'
import { termsAndConditionsReducer } from './03_Reducers/termsAndConditionsReducer'
import { appConfigReducer } from './03_Reducers/appConfigReducer'
import { componentsReducer } from './03_Reducers/componentsReducer'
import { galleryReducer } from './03_Reducers/gallery/galleryReducer'
import { galleryItemInfoReducer } from './03_Reducers/gallery/galleryItemInfoReducer'
import { editGalleryItemReducer } from './03_Reducers/gallery/editGalleryItemReducer'
import { deleteGalleryItemReducer } from './03_Reducers/gallery/deleteGalleryItemReducer'
import { addGalleryItemReducer } from './03_Reducers/gallery/addGalleryItemReducer'
import { signInReducer } from './03_Reducers/Auth/signInReducer'

const rootReducer = combineReducers({
  appConfig: appConfigReducer,
  signIn: signInReducer,
  getUser: getUserReducer,
  userRegister: userRegisterReducer,
  userInfo: userInfoReducer,
  userList: usersListReducer,
  userDelete: userDeleteReducer,
  toggleAdminStatus: toggleAdminStatusReducer,
  userUpdateOwnProfile: userUpdateOwnProfileReducer,
  productInfo: productInfoReducer,
  productList: productsListReducer,
  productDelete: productDeleteReducer,
  updateProduct: updateProductReducer,
  createProduct: createProductReducer,
  orderInfo: orderInfoReducer,
  orderList: ordersListReducer,
  orderCreate: orderCreateReducer,
  orderPay: orderPayReducer,
  orderManage: orderManageReducer,
  myOrders: myOrdersReducer,
  cart: cartReducer,
  statistic: statisticReducer,
  api: apiReducer,
  termsAndConditions: termsAndConditionsReducer,
  components: componentsReducer,
  // Gallery
  gallery: galleryReducer,
  galleryItemInfo: galleryItemInfoReducer,
  editGalleryItem: editGalleryItemReducer,
  deleteGalleryItem: deleteGalleryItemReducer,
  addGalleryItem: addGalleryItemReducer,
})

// @ts-ignore
const cartItemsFromStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? // @ts-ignore
    JSON.parse(localStorage.getItem('shippingAddress'))
  : {}

// @ts-ignore
const paymentMethodFromStorage = localStorage.getItem('paymentMethod') ? localStorage.getItem('paymentMethod') : ''
const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
    paymentMethod: paymentMethodFromStorage,
  },
}

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
// @ts-ignore
const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(thunk)))



export type StateType = ReturnType<typeof rootReducer>
// export type AppStoreType = ReturnType<typeof createStore>

export default store
