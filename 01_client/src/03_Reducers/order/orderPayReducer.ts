import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  success: false,
  loading: false,
  error: null as string | null,
}

export const orderPayReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'ORDER_PAY_REQUEST':
      return { ...initialState, loading: true }
    case 'ORDER_PAY_SUCCESS':
      return { ...initialState, success: true }
    case 'ORDER_PAY_FAIL':
      return { ...initialState, error: action.payload }
    case 'ORDER_PAY_RESET':
      return { ...initialState }
    default:
      return state
  }
}

export const actions = {
  orderPayRequestAC: () => ({ type: 'ORDER_PAY_REQUEST' as const }),
  orderPaySuccessAC: () => ({ type: 'ORDER_PAY_SUCCESS' as const }),
  orderPayFailAC: (errMessage: string) => ({ type: 'ORDER_PAY_FAIL' as const, payload: errMessage }),
  orderPayResetAC: () => ({ type: 'ORDER_PAY_RESET' as const }),
}

export function payOrderThunk(orderId: string, paymentResult: any): ThunkType {
  return async function (dispatch) {
    try {
      dispatch(actions.orderPayRequestAC())
      await API.order.payOrder(orderId, paymentResult)
      dispatch(actions.orderPaySuccessAC())
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.orderPayFailAC(errMsg))
        return
      }
      dispatch(actions.orderPayFailAC(error))
    }
  }
}
