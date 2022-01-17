import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { OrderToAPI } from '../../05_Types/APIResponse'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

// todo any

const initialState = {
  order: null as null | any,
  loading: false,
  fail: '',
}

export const orderCreateReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'ORDER_CREATE_REQUEST':
      return { ...initialState, loading: true }
    case 'ORDER_CREATE_SUCCESS':
      return { ...initialState, order: action.payload }
    case 'ORDER_CREATE_FAIL':
      return { ...initialState, fail: action.payload }
    case 'ORDER_CREATE_RESET':
      return { ...initialState }
    default:
      return state
  }
}

export const actions = {
  request: () => ({ type: 'ORDER_CREATE_REQUEST' as const }),
  success: (data: any) => ({ type: 'ORDER_CREATE_SUCCESS' as const, payload: data }),
  fail: (errMessage: string) => ({ type: 'ORDER_CREATE_FAIL' as const, payload: errMessage }),
  reset: () => ({ type: 'ORDER_CREATE_RESET' as const }),
}

export function createOrderThunk(newOrder: OrderToAPI): ThunkType {
  return async function (dispatch) {
    try {
      dispatch(actions.request())
      const { data } = await API.order.createOrder(newOrder)
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
