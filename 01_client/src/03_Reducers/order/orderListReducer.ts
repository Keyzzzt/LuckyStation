import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { Order } from '../../05_Types/APIResponse'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  orderList: null as null | Order[],
  loading: false,
  error: null as string | null,
}

export const orderListReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'ORDER_LIST_REQUEST':
      return { ...initialState, loading: true }
    case 'ORDER_LIST_SUCCESS':
      return { ...initialState, orderList: action.payload }

    case 'ORDER_LIST_FAIL':
      return { ...initialState, error: action.payload }

    default:
      return state
  }
}

export const actions = {
  getOrdersRequestAC: () => ({ type: 'ORDER_LIST_REQUEST' as const }),
  getOrdersSuccessAC: (data: Order[]) => ({ type: 'ORDER_LIST_SUCCESS' as const, payload: data }),
  getOrdersFailAC: (errMessage: string) => ({ type: 'ORDER_LIST_FAIL' as const, payload: errMessage }),
}

export function orderListThunk(page: number, limit: number): ThunkType {
  return async function (dispatch) {
    try {
      dispatch(actions.getOrdersRequestAC())
      const { data } = await API.admin.getOrders(page, limit)
      dispatch(actions.getOrdersSuccessAC(data.items))
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.getOrdersFailAC(errMsg))
        return
      }
      dispatch(actions.getOrdersFailAC(error))
    }
  }
}
