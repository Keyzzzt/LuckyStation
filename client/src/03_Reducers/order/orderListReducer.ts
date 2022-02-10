import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { OrderFromAPI } from '../../05_Types/APIResponse'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  orders: null as null | OrderFromAPI[],
  fail: '',
}

export const orderListReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'ORDER_LIST_SUCCESS':
      return { ...initialState, orders: action.payload }
    case 'ORDER_LIST_FAIL':
      return { ...initialState, fail: action.payload }
    default:
      return state
  }
}

export const actions = {
  success: (data: OrderFromAPI[]) => ({ type: 'ORDER_LIST_SUCCESS' as const, payload: data }),
  fail: (errMessage: string) => ({ type: 'ORDER_LIST_FAIL' as const, payload: errMessage }),
}

export function orderListThunk(page: number, limit: number): ThunkType {
  return async function (dispatch) {
    try {
      const { data } = await API.admin.getOrders(page, limit)
      dispatch(actions.success(data.items))
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.fail(errMsg))
        return
      }
      dispatch(actions.fail(error))
    }
  }
}
