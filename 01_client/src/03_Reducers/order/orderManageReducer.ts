import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  successDelivered: false,
  successNotDelivered: false,
  successPaid: false,
  successNotPaid: false,
  successDelete: false,
  loading: false,
  manageOrderError: '',
}

export const orderManageReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'MANAGE_ORDER_REQUEST':
      return { ...initialState, loading: true }

    case 'DELIVERED_SUCCESS':
      return { ...initialState, successDelivered: true }
    case 'NOT_DELIVERED_SUCCESS':
      return { ...initialState, successNotDelivered: true }
    case 'PAID_SUCCESS':
      return { ...initialState, successPaid: true }
    case 'NOT_PAID_SUCCESS':
      return { ...initialState, successNotPaid: true }
    case 'ORDER_DELETE_SUCCESS':
      return { ...initialState, successNotPaid: true }

    case 'DELIVERED_FAIL':
    case 'PAID_FAIL':
    case 'NOT_DELIVERED_FAIL':
    case 'NOT_PAID_FAIL':
    case 'ORDER_DELETE_FAIL':
      return { ...initialState, manageOrderError: action.payload }

    case 'ORDER_MANAGE_RESET':
      return { ...initialState }
    default:
      return state
  }
}

export const actions = {
  manageOrderRequestAC: () => ({ type: 'MANAGE_ORDER_REQUEST' as const }),

  deliveredSuccessAC: () => ({ type: 'DELIVERED_SUCCESS' as const }),
  notDeliveredSuccessAC: () => ({ type: 'NOT_DELIVERED_SUCCESS' as const }),
  paidSuccessAC: () => ({ type: 'PAID_SUCCESS' as const }),
  notPaidSuccessAC: () => ({ type: 'NOT_PAID_SUCCESS' as const }),
  deleteOrderSuccessAC: () => ({ type: 'ORDER_DELETE_SUCCESS' as const }),

  deliveredFailAC: (errMessage: string) => ({ type: 'DELIVERED_FAIL' as const, payload: errMessage }),
  notDeliveredFailAC: (errMessage: string) => ({ type: 'NOT_DELIVERED_FAIL' as const, payload: errMessage }),
  paidFailAC: (errMessage: string) => ({ type: 'PAID_FAIL' as const, payload: errMessage }),
  notPaidFailAC: (errMessage: string) => ({ type: 'NOT_PAID_FAIL' as const, payload: errMessage }),
  deleteOrderFailAC: (errMessage: string) => ({ type: 'ORDER_DELETE_FAIL' as const, payload: errMessage }),

  orderManageResetAC: () => ({ type: 'ORDER_MANAGE_RESET' as const }),
}

export function deliveredThunk(orderId: string): ThunkType {
  return async function (dispatch) {
    try {
      dispatch(actions.manageOrderRequestAC())
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
export function notDeliveredThunk(orderId: string): ThunkType {
  return async function (dispatch) {
    try {
      dispatch(actions.manageOrderRequestAC())
      await API.admin.setToNotDelivered(orderId)
      dispatch(actions.notDeliveredSuccessAC())
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.notDeliveredFailAC(errMsg))
        return
      }
      dispatch(actions.notDeliveredFailAC(error))
    }
  }
}
export function paidThunk(orderId: string): ThunkType {
  return async function (dispatch) {
    try {
      dispatch(actions.manageOrderRequestAC())
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
export function notPaidThunk(orderId: string): ThunkType {
  return async function (dispatch) {
    try {
      dispatch(actions.manageOrderRequestAC())
      await API.admin.setToNotPaid(orderId)
      dispatch(actions.notPaidSuccessAC())
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.notPaidFailAC(errMsg))
        return
      }
      dispatch(actions.notPaidFailAC(error))
    }
  }
}
export function deleteOrderThunk(orderId: string): ThunkType {
  return async function (dispatch) {
    try {
      dispatch(actions.manageOrderRequestAC())
      await API.admin.deleteOrder(orderId)
      dispatch(actions.deleteOrderSuccessAC())
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.deleteOrderFailAC(errMsg))
        return
      }
      dispatch(actions.deleteOrderFailAC(error))
    }
  }
}
