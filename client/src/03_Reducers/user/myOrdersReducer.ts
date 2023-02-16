import { API } from '../../API'
import { BaseThunkType, InferActionTypes, RequestBodyValidationErrorsType } from '../../05_Types/01_Base'
import { OrderResponseType } from '../../05_Types/ResponseTypes'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  orders: null as null | OrderResponseType[],
  loading: false,
  fail: '',
}

export const myOrdersReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'MY_ORDERS_REQUEST':
      return { ...state, orders: null, fail: '', loading: true  }
    case 'MY_ORDERS_SUCCESS':
      return { ...state, orders: action.payload, loading: false }
    case 'MY_ORDERS_FAIL':
      return { ...state, fail: action.payload, loading: false }
    default:
      return state
  }
}

export const actions = {
  requestAC: () => ({ type: 'MY_ORDERS_REQUEST' as const }),
  successAC: (orders: OrderResponseType[]) => ({ type: 'MY_ORDERS_SUCCESS' as const, payload: orders }),
  failAC: (errMessage: string) => ({ type: 'MY_ORDERS_FAIL' as const, payload: errMessage }),
}

export function myOrdersTC(page: number, limit: number): ThunkType {
  return async function (dispatch) {
    try {
      const { data } = await API.user.myOrders(page, limit)
      dispatch(actions.successAC(data.items))
    } catch (err: any) {
      const { errors, fail }: { errors: RequestBodyValidationErrorsType[], fail: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.failAC(errMsg))
        return
      }
      dispatch(actions.failAC(fail))
    }
  }
}
