import { API } from '../../API'
import { BaseThunkType, InferActionTypes, RequestBodyValidationErrorsType } from '../../05_Types/01_Base'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  updatedProduct: null as null | any,
  loading: false,
  fail: '',
}

export const updateProductReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'UPDATE_PRODUCT_REQUEST':
      return { ...state, updatedProduct: null, fail: '', loading: true }
    case 'UPDATE_PRODUCT_SUCCESS':
      return { ...state, updatedProduct: action.payload, loading: false }
    case 'UPDATE_PRODUCT_FAIL':
      return { ...state, fail: action.payload, loading: false }
    default:
      return state
  }
}

export const actions = {
  requestAC: () => ({ type: 'UPDATE_PRODUCT_REQUEST' as const }),
  successAC: (product: any) => ({ type: 'UPDATE_PRODUCT_SUCCESS' as const, payload: product }),
  failAC: (errMessage: string) => ({ type: 'UPDATE_PRODUCT_FAIL' as const, payload: errMessage }),
}

export function updateProductTC(productId: string, product: any): ThunkType {
  return async (dispatch) => {
    try {
      dispatch(actions.requestAC())
      const { data } = await API.admin.updateProduct(productId, product)
      dispatch(actions.successAC(data))
    } catch (err: any) {
      const { errors, fail }: { errors: RequestBodyValidationErrorsType[], fail: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.failAC(errMsg))
        return
      }
      dispatch(actions.failAC(fail))
    }
  }
}
