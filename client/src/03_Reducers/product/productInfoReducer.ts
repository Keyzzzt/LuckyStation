import { API } from '../../API'
import { BaseThunkType, InferActionTypes, RequestBodyValidationErrorsType } from '../../05_Types/01_Base'
import { ProductResponseType } from '../../05_Types/ResponseTypes'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  productInfo: null as null | ProductResponseType,
  loading: false,
  fail: '',
}

export const productInfoReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'PRODUCT_INFO_REQUEST':
      return { ...state, productInfo: null, fail: '', loading: true }
    case 'PRODUCT_INFO_SUCCESS':
      return { ...state, productInfo: action.payload, loading: false }
    case 'PRODUCT_INFO_FAIL':
      return { ...state, fail: action.payload, loading: false }

    default:
      return state
  }
}

export const actions = {
  requestAC: () => ({ type: 'PRODUCT_INFO_REQUEST' as const}),
  successAC: (product: ProductResponseType) => ({ type: 'PRODUCT_INFO_SUCCESS' as const, payload: product }),
  failAC: (errMessage: string) => ({ type: 'PRODUCT_INFO_FAIL' as const, payload: errMessage }),
}

export function productInfoTC(productId: string): ThunkType {
  return async (dispatch) => {
    try {
      dispatch(actions.requestAC())
      const { data } = await API.admin.getSingleProduct(productId)
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
