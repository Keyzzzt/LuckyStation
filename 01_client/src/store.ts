import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { authReducer } from './03_Reducers/userReducers'
import { productsReducer } from './03_Reducers/productListReducer'

const rootReducer = combineReducers({
  products: productsReducer,
  auth: authReducer,
})

const initialState = {}

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))

export type StateType = ReturnType<typeof rootReducer>
// @ts-ignore
window.__store__ = store

export default store