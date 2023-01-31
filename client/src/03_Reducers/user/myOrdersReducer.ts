import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { OrderResponseType } from '../../05_Types/ResponseTypes'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  orders: null as null | OrderResponseType[],
  error: '',
}

export const myOrdersReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'MY_ORDERS_SUCCESS':
      return { ...initialState, orders: action.payload }
    case 'MY_ORDERS_FAIL':
      return { ...initialState, error: action.payload }
    case 'MY_ORDERS_RESET':
      return { ...initialState }
    default:
      return state
  }
}

export const actions = {
  myOrdersSuccessAC: (orders: OrderResponseType[]) => ({ type: 'MY_ORDERS_SUCCESS' as const, payload: orders }),
  myOrdersFailAC: (errMessage: string) => ({ type: 'MY_ORDERS_FAIL' as const, payload: errMessage }),
  myOrdersResetAC: () => ({ type: 'MY_ORDERS_RESET' as const }),
}

export function myOrdersThunk(page: number, limit: number): ThunkType {
  return async function (dispatch) {
    try {
      const { data } = await API.user.myOrders(page, limit)
      dispatch(actions.myOrdersSuccessAC(data.items))
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.myOrdersFailAC(errMsg))
        return
      }
      dispatch(actions.myOrdersFailAC(error))
    }
  }
}
