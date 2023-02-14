import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { OrderCreateRequestType } from '../../05_Types/ResponseTypes'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  orderId: null as null | string,
  loading: false,
  fail: '',
}

export const orderCreateReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'ORDER_CREATE_REQUEST':
      return { ...state, orderId: null, fail: '', loading: true }
    case 'ORDER_CREATE_SUCCESS':
      return { ...state, orderId: action.payload, loading: false }
    case 'ORDER_CREATE_FAIL':
      return { ...state, fail: action.payload, loading: false }

    default:
      return state
  }
}

export const actions = {
  requestAC: () => ({ type: 'ORDER_CREATE_REQUEST' as const }),
  successAC: (data: string) => ({ type: 'ORDER_CREATE_SUCCESS' as const, payload: data }),
  failAC: (errMessage: string) => ({ type: 'ORDER_CREATE_FAIL' as const, payload: errMessage }),
}

export function createOrderTC(newOrder: OrderCreateRequestType): ThunkType {
  return async function (dispatch) {
    try {
      dispatch(actions.requestAC())
      const { data } = await API.order.createOrder(newOrder)
      dispatch(actions.successAC(data))
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map(e => e.msg).join('; ')
        dispatch(actions.failAC(errMsg))
        return
      }
      dispatch(actions.failAC(error))
    }
  }
}
