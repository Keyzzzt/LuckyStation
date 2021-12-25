import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { Order } from '../../05_Types/APIResponse'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  orderInfo: null as null | Order,
  loading: false,
  error: null as string | null,
}

export const orderInfoReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'ORDER_INFO_REQUEST':
      return { ...state, loading: true, error: null }
    case 'ORDER_INFO_SUCCESS':
      return { loading: false, error: null, orderInfo: action.payload }

    case 'ORDER_INFO_FAIL':
      return { loading: false, error: action.payload, orderInfo: null }

    default:
      return state
  }
}

export const actions = {
  getSingleOrderRequestAC: () => ({ type: 'ORDER_INFO_REQUEST' as const }),
  getSingleOrderSuccessAC: (data: Order) => ({ type: 'ORDER_INFO_SUCCESS' as const, payload: data }),
  getSingleOrderFailAC: (errMessage: string) => ({ type: 'ORDER_INFO_FAIL' as const, payload: errMessage }),
}

export function getSingleOrderThunk(orderId: string): ThunkType {
  return async function (dispatch, getState) {
    try {
      dispatch(actions.getSingleOrderRequestAC())
      const { data } = await API.admin.getSingleOrder(orderId)
      dispatch(actions.getSingleOrderSuccessAC(data))
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.getSingleOrderFailAC(errMsg))
        return
      }
      dispatch(actions.getSingleOrderFailAC(error))
    }
  }
}
