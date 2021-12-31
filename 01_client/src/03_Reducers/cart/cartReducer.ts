import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { Product } from '../../05_Types/APIResponse'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

type Address = {
  address: string
  country: string
  city: string
  postalCode: string
}

const initialState = {
  cartItems: [] as Product[],
  shippingAddress: {} as Address,
  paymentMethod: 'PayPal',
  itemsPrice: 0 as number,
  shippingPrice: 0 as number,
  taxPrice: 0 as number,
  totalPrice: 0 as number,
  loading: false,
  error: '',
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
    case 'SAVE_SHIPPING_ADDRESS':
      return { ...state, shippingAddress: action.payload }
    case 'SAVE_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.payload }
    case 'CART_RESET':
      return { ...initialState }
    default:
      return state
  }
}

export const actions = {
  cartAddAC: (product: Product) => ({ type: 'CART_ADD' as const, payload: product }),
  cartRemoveAC: (productId: string) => ({ type: 'CART_REMOVE' as const, payload: productId }),
  cartResetAC: () => ({ type: 'CART_RESET' as const }),
  cartFailAC: (error: string) => ({ type: 'CART_FAIL' as const, payload: error }),
  saveSippingAddressAC: (address: any) => ({ type: 'SAVE_SHIPPING_ADDRESS' as const, payload: address }),
  savePaymentMethodAC: (paymentMethod: any) => ({ type: 'SAVE_PAYMENT_METHOD' as const, payload: paymentMethod }),
}

export function addToCartThunk(productId: string, qty: number): ThunkType {
  return async (dispatch, getState) => {
    try {
      const { data } = await API.admin.getSingleProduct(productId)
      data.qty = qty
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
export function saveAddressThunk(address: any): ThunkType {
  return async (dispatch) => {
    dispatch(actions.saveSippingAddressAC(address))
    localStorage.setItem('shippingAddress', JSON.stringify(address))
  }
}

export function savePaymentMethodThunk(method: string): ThunkType {
  return async (dispatch) => {
    dispatch(actions.savePaymentMethodAC(method))
    localStorage.setItem('paymentMethod', method)
  }
}
