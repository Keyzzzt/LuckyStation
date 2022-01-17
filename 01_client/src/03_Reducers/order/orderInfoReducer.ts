import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { OrderFromAPI } from '../../05_Types/APIResponse'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  orderInfo: null as null | OrderFromAPI,
  loading: false,
  fail: '',
}

export const orderInfoReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'ORDER_INFO_REQUEST':
      return { ...initialState, loading: true }
    case 'ORDER_INFO_SUCCESS':
      return { ...initialState, orderInfo: action.payload }
    case 'ORDER_INFO_FAIL':
      return { ...initialState, fail: action.payload }
    case 'ORDER_INFO_RESET':
      return { ...initialState }
    default:
      return state
  }
}

export const actions = {
  request: () => ({ type: 'ORDER_INFO_REQUEST' as const }),
  success: (data: OrderFromAPI) => ({ type: 'ORDER_INFO_SUCCESS' as const, payload: data }),
  fail: (errMessage: string) => ({ type: 'ORDER_INFO_FAIL' as const, payload: errMessage }),
  reset: () => ({ type: 'ORDER_INFO_RESET' as const }),
}

export function orderInfoThunk(orderId: string): ThunkType {
  return async function (dispatch, getState) {
    try {
      dispatch(actions.request())
      const { data } = await API.admin.getSingleOrder(orderId)
      dispatch(actions.success(data))
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
