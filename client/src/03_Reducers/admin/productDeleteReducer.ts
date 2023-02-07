import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { Dispatch } from 'redux'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  success: false,
  loading: false,
  fail: '',
}

export const productDeleteReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'PRODUCT_DELETE_REQUEST':
      return { ...initialState, loading: true }
    case 'PRODUCT_DELETE_SUCCESS':
      return { ...initialState, success: true }
    case 'PRODUCT_DELETE_FAIL':
      return { ...initialState, fail: action.payload }
    case 'PRODUCT_DELETE_RESET':
      return { ...initialState }
    default:
      return state
  }
}

export const actions = {
  request: () => ({ type: 'PRODUCT_DELETE_REQUEST' as const }),
  success: () => ({ type: 'PRODUCT_DELETE_SUCCESS' as const }),
  fail: (errMessage: string) => ({ type: 'PRODUCT_DELETE_FAIL' as const, payload: errMessage }),
  reset: () => ({ type: 'PRODUCT_DELETE_RESET' as const }),
}

export function productDeleteThunk(productId: string): ThunkType {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(actions.request())
      await API.admin.deleteProduct(productId)
      dispatch(actions.success())
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
