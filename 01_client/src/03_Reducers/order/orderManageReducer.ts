import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { OrderToAPI } from '../../05_Types/APIResponse'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  successDelivered: false,
  successNotDelivered: false,
  successPaid: false,
  successNotPaid: false,
  loading: false,
  error: '',
}

export const orderManageReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'DELIVERED_REQUEST':
    case 'PAID_REQUEST':
      return { ...initialState, loading: true }
    case 'DELIVERED_SUCCESS':
      return { ...initialState, successDelivered: true }
    case 'PAID_SUCCESS':
      return { ...initialState, successPaid: true }
    case 'DELIVERED_FAIL':
    case 'PAID_FAIL':
      return { ...initialState, error: action.payload }
    case 'ORDER_MANAGE_RESET':
      return { ...initialState }
    default:
      return state
  }
}

export const actions = {
  deliveredRequestAC: () => ({ type: 'DELIVERED_REQUEST' as const }),
  deliveredSuccessAC: () => ({ type: 'DELIVERED_SUCCESS' as const }),
  deliveredFailAC: (errMessage: string) => ({ type: 'DELIVERED_FAIL' as const, payload: errMessage }),

  paidRequestAC: () => ({ type: 'PAID_REQUEST' as const }),
  paidSuccessAC: () => ({ type: 'PAID_SUCCESS' as const }),
  paidFailAC: (errMessage: string) => ({ type: 'PAID_FAIL' as const, payload: errMessage }),

  orderManageResetAC: () => ({ type: 'ORDER_MANAGE_RESET' as const }),
}

export function setToDeliveredThunk(orderId: string): ThunkType {
  return async function (dispatch) {
    try {
      dispatch(actions.deliveredRequestAC())
      await API.admin.setToDelivered(orderId)
      dispatch(actions.deliveredSuccessAC())
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.deliveredFailAC(errMsg))
        return
      }
      dispatch(actions.deliveredFailAC(error))
    }
  }
}
export function setToPaidThunk(orderId: string): ThunkType {
  return async function (dispatch) {
    try {
      dispatch(actions.paidRequestAC())
      await API.admin.setToPaid(orderId)
      dispatch(actions.paidSuccessAC())
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.paidFailAC(errMsg))
        return
      }
      dispatch(actions.paidFailAC(error))
    }
  }
}
