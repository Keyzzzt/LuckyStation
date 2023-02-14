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
      return { ...state, success: false, fail: '', loading: true }
    case 'ORDER_PAY_SUCCESS':
      return { ...state, success: true, loading: false }
    case 'ORDER_PAY_FAIL':
      return { ...state, fail: action.payload, loading: false }
    default:
      return state
  }
}

export const actions = {
  requestAC: () => ({ type: 'ORDER_PAY_REQUEST' as const }),
  successAC: () => ({ type: 'ORDER_PAY_SUCCESS' as const }),
  failAC: (errMessage: string) => ({ type: 'ORDER_PAY_FAIL' as const, payload: errMessage }),
}

export function orderPayTC(orderId: string, paymentResult: any): ThunkType {
  return async function (dispatch) {
    try {
      dispatch(actions.requestAC())
      await API.order.payOrder(orderId, paymentResult)
      dispatch(actions.successAC())
      localStorage.removeItem('cartItems')
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.failAC(errMsg))
        return
      }
      dispatch(actions.failAC(error))
    }
  }
}
