import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  success: false,
  loading: false,
  fail: '',
}

export const orderPayReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'ORDER_PAY_REQUEST':
      return { ...initialState, loading: true }
    case 'ORDER_PAY_SUCCESS':
      return { ...initialState, success: true }
    case 'ORDER_PAY_FAIL':
      return { ...initialState, fail: action.payload }
    case 'ORDER_PAY_RESET':
      return { ...initialState }
    default:
      return state
  }
}

export const actions = {
  request: () => ({ type: 'ORDER_PAY_REQUEST' as const }),
  success: () => ({ type: 'ORDER_PAY_SUCCESS' as const }),
  fail: (errMessage: string) => ({ type: 'ORDER_PAY_FAIL' as const, payload: errMessage }),
  reset: () => ({ type: 'ORDER_PAY_RESET' as const }),
}

export function payOrderThunk(orderId: string, paymentResult: any): ThunkType {
  return async function (dispatch) {
    try {
      dispatch(actions.request())
      await API.order.payOrder(orderId, paymentResult)
      dispatch(actions.success())
      localStorage.removeItem('cartItems')
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.fail(errMsg))
        return
      }
      dispatch(actions.fail(error))
    }
  }
}
