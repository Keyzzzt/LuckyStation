import { API } from '../../API'
import { BaseThunkType, InferActionTypes, RequestBodyValidationErrorsType } from '../../05_Types/01_Base'
import { ProductResponseType } from '../../05_Types/ResponseTypes'
import { StateType } from '../../store/store'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

// TODO decomposition


export type ContactInfo = {
  name: string
  lastName: string
  address: string
  city: string
  postalCode: string
  apartment: string
  country: string
  phone: string
}

const initialState = {
  cartItems: [] as ProductResponseType[],
  shippingAddress: {
    name: '',
  } as ContactInfo,
  paymentMethod: 'PayPal',
  itemsPrice: 0 as number,
  shippingPrice: 0 as number,
  taxPrice: 0 as number,
  totalPrice: 0 as number,
  loading: false,
  fail: '',
}

export const cartReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'CART_ADD':
      const item = action.payload
      const isItem = state.cartItems.find(n => n._id === item._id)
      if (isItem) {
        return { ...state, cartItems: state.cartItems.map(n => (n._id === isItem._id ? item : n)) }
      } else {
        return { ...state, cartItems: [...state.cartItems, item] }
      }
    case 'CART_REMOVE':
      return { ...state, cartItems: state.cartItems.filter(n => n._id !== action.payload) }
    case 'CART_FAIL':
      return { ...state, fail: action.payload }
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
  cartAddAC: (product: ProductResponseType) => ({ type: 'CART_ADD' as const, payload: product }),
  cartRemoveAC: (productId: string) => ({ type: 'CART_REMOVE' as const, payload: productId }),
  cartResetAC: () => ({ type: 'CART_RESET' as const }),
  cartFailAC: (error: string) => ({ type: 'CART_FAIL' as const, payload: error }),
  saveSippingAddressAC: (contactInfo: ContactInfo) => ({
    type: 'SAVE_SHIPPING_ADDRESS' as const,
    payload: contactInfo,
  }),
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
      const { errors, fail }: { errors: RequestBodyValidationErrorsType[], fail: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map(e => e.msg).join('; ')
        dispatch(actions.cartFailAC(errMsg))
        return
      }
      dispatch(actions.cartFailAC(fail))
    }
  }
}
export function removeFromCartThunk(productId: string): ThunkType {
  return async (dispatch, getState) => {
    try {
      dispatch(actions.cartRemoveAC(productId))
      localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
    } catch (err: any) {
      const { errors, fail }: { errors: RequestBodyValidationErrorsType[], fail: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map(e => e.msg).join('; ')
        dispatch(actions.cartFailAC(errMsg))
        return
      }
      dispatch(actions.cartFailAC(fail))
    }
  }
}
export function saveContactInfoThunk(contactInfo: ContactInfo): ThunkType {
  return async dispatch => {
    dispatch(actions.saveSippingAddressAC(contactInfo))
    localStorage.setItem('shippingAddress', JSON.stringify(contactInfo))
  }
}

export function savePaymentMethodThunk(method: string): ThunkType {
  return async dispatch => {
    dispatch(actions.savePaymentMethodAC(method))
    localStorage.setItem('paymentMethod', method)
  }
}
