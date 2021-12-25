import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { Product } from '../../05_Types/APIResponse'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  cartItems: [] as Product[],
  loading: false,
  error: null as string | null,
}

export const cartReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'CART_ADD':
      const item = action.payload
      const isItem = state.cartItems.find((n) => n._id === item._id)
      if (isItem) {
        return { ...state, cartItems: state.cartItems.map((n) => (n._id === isItem._id ? item : n)) }
      } else {
        return { ...state, cartItems: [...state.cartItems, item] }
      }

    case 'CART_REMOVE':
      return { ...state, cartItems: state.cartItems.filter((n) => n._id !== action.payload) }
    case 'CART_FAIL':
      return { ...state, error: action.payload }
    default:
      return state
  }
}

export const actions = {
  cartAddAC: (product: Product) => ({ type: 'CART_ADD' as const, payload: product }),
  cartRemoveAC: (productId: string) => ({ type: 'CART_REMOVE' as const, payload: productId }),
  cartFailAC: (error: string) => ({ type: 'CART_FAIL' as const, payload: error }),
}

export function addToCartThunk(productId: string, qty: number): ThunkType {
  return async (dispatch, getState) => {
    try {
      const { data } = await API.admin.getSingleProduct(productId)
      data.qty = qty
      console.log(data)

      dispatch(actions.cartAddAC(data))
      localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.cartFailAC(errMsg))
        return
      }
      dispatch(actions.cartFailAC(error))
    }
  }
}
export function removeFromCartThunk(productId: string): ThunkType {
  return async (dispatch, getState) => {
    try {
      dispatch(actions.cartRemoveAC(productId))
      localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.cartFailAC(errMsg))
        return
      }
      dispatch(actions.cartFailAC(error))
    }
  }
}
