import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { OrderResponseType } from '../../05_Types/ResponseTypes'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  orders: null as null | OrderResponseType[],
  loading: false,
  fail: '',
}

export const ordersListReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'ORDER_LIST_REQUEST':
      return { ...state, orders: null, fail: '', loading: true }
    case 'ORDER_LIST_SUCCESS':
      return { ...state, orders: action.payload, loading: false }
    case 'ORDER_LIST_FAIL':
      return { ...state, fail: action.payload, loading: false }
    default:
      return state
  }
}

export const actions = {
  requestAC: () => ({ type: 'ORDER_LIST_REQUEST' as const}),
  successAC: (data: OrderResponseType[]) => ({ type: 'ORDER_LIST_SUCCESS' as const, payload: data }),
  failAC: (errMessage: string) => ({ type: 'ORDER_LIST_FAIL' as const, payload: errMessage }),
}

export function orderListTC(page: number, limit: number): ThunkType {
  return async function (dispatch) {
    try {
      dispatch(actions.requestAC())
      const { data } = await API.admin.getOrders(page, limit)
      dispatch(actions.successAC(data.items))
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
