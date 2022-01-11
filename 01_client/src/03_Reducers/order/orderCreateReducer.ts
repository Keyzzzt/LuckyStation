import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { OrderToAPI } from '../../05_Types/APIResponse'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  order: '',
  success: false,
  loading: false,
  error: '',
}

export const orderCreateReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'ORDER_CREATE_REQUEST':
      return { ...initialState, loading: true }
    case 'ORDER_CREATE_SUCCESS':
      return { ...initialState, success: true, order: action.payload }
    case 'ORDER_CREATE_FAIL':
      return { ...initialState, error: action.payload }
    case 'ORDER_CREATE_RESET':
      return { ...initialState }
    default:
      return state
  }
}

export const actions = {
  createOrderRequestAC: () => ({ type: 'ORDER_CREATE_REQUEST' as const }),
  createOrderSuccessAC: (data: any) => ({ type: 'ORDER_CREATE_SUCCESS' as const, payload: data }),
  createOrderFailAC: (errMessage: string) => ({ type: 'ORDER_CREATE_FAIL' as const, payload: errMessage }),
  createOrderResetAC: () => ({ type: 'ORDER_CREATE_RESET' as const }),
}

export function createOrderThunk(newOrder: OrderToAPI): ThunkType {
  return async function (dispatch) {
    try {
      dispatch(actions.createOrderRequestAC())
      const { data } = await API.order.createOrder(newOrder)
      dispatch(actions.createOrderSuccessAC(data))
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.createOrderFailAC(errMsg))
        return
      }
      dispatch(actions.createOrderFailAC(error))
    }
  }
}
