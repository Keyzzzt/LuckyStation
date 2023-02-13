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

export const createProductReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'CREATE_PRODUCT_REQUEST':
      return { ...state, success: false, fail: '', loading: true }
    case 'CREATE_PRODUCT_SUCCESS':
      return { ...state, success: true, loading: false }
    case 'CREATE_PRODUCT_FAIL':
      return { ...state, fail: action.payload, loading: false }
    default:
      return state
  }
}

export const actions = {
  requestAC: () => ({ type: 'CREATE_PRODUCT_REQUEST' as const }),
  successAC: () => ({ type: 'CREATE_PRODUCT_SUCCESS' as const }),
  failAC: (errMessage: string) => ({ type: 'CREATE_PRODUCT_FAIL' as const, payload: errMessage }),
}

export function createProductThunk(product: any): ThunkType {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(actions.requestAC())
      await API.admin.createProduct(product)
      dispatch(actions.successAC())
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.failAC(errMsg))
        return
      }
      dispatch(actions.failAC(error))
    }
  }
}
