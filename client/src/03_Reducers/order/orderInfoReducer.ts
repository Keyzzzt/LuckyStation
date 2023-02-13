import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { OrderResponseType } from '../../05_Types/ResponseTypes'
import { Dispatch } from 'redux'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  orderInfo: null as null | OrderResponseType,
  loading: false,
  fail: '',
}

export const orderInfoReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'ORDER_INFO_REQUEST':
      return { ...state, orderInfo: null, fail: '', loading: true }
    case 'ORDER_INFO_SUCCESS':
      return { ...state, orderInfo: action.payload, loading: false }
    case 'ORDER_INFO_FAIL':
      return { ...state, fail: action.payload, loading: false }
    default:
      return state
  }
}

export const actions = {
  requestAC: () => ({ type: 'ORDER_INFO_REQUEST' as const }),
  successAC: (data: OrderResponseType) => ({ type: 'ORDER_INFO_SUCCESS' as const, payload: data }),
  failAC: (errMessage: string) => ({ type: 'ORDER_INFO_FAIL' as const, payload: errMessage }),
}

export function orderInfoThunk(orderId: string): ThunkType {
  return async function (dispatch: Dispatch) {
    try {
      dispatch(actions.requestAC())
      const { data } = await API.admin.getSingleOrder(orderId)
      dispatch(actions.successAC(data))
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
