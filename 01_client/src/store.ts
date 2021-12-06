import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { authReducer } from './03_Reducers/userReducers'

const rootReducer = combineReducers({
  auth: authReducer,
})

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))

export type StateType = ReturnType<typeof rootReducer>
export type AppStoreType = ReturnType<typeof createStore>

export default store
