import { PRODUCT_LIST_FAIL, PRODUCT_LIST_REQUEST, PRODUCT_LIST_SUCCESS } from '../constants'
import { BaseThunkType, InferActionTypes } from '../Types'

type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  products: null as null | [],
  loading: false,
  error: null as null | string,
}

export const productsReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return { ...state, loading: true }
    case PRODUCT_LIST_SUCCESS:
      return { ...state, loading: false, products: action.payload }
    case PRODUCT_LIST_FAIL:
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

export const actions = {
  fetchAllProducts: () => ({ type: 'OK', payload: null }),
}
