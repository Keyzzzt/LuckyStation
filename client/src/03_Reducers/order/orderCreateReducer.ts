import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { OrderCreateRequestType } from '../../05_Types/ResponseTypes'
import { Dispatch } from 'redux'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  orderId: '',
  fail: '',
}

export const orderCreateReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'ORDER_CREATE_SUCCESS':
      return { ...initialState, orderId: action.payload }
    case 'ORDER_CREATE_FAIL':
      return { ...initialState, fail: action.payload }
    case 'ORDER_CREATE_RESET':
      return { ...initialState }
    default:
      return state
  }
}

export const actions = {
  success: (data: any) => ({ type: 'ORDER_CREATE_SUCCESS' as const, payload: data }),
  fail: (errMessage: string) => ({ type: 'ORDER_CREATE_FAIL' as const, payload: errMessage }),
  reset: () => ({ type: 'ORDER_CREATE_RESET' as const }),
}

export function createOrderThunk(newOrder: OrderCreateRequestType): ThunkType {
  return async function (dispatch: Dispatch) {
    try {
      const { data } = await API.order.createOrder(newOrder)
      dispatch(actions.success(data))
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map(e => e.msg).join('; ')
        dispatch(actions.fail(errMsg))
        return
      }
      dispatch(actions.fail(error))
    }
  }
}
