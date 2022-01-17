import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { Product } from '../../05_Types/APIResponse'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  productInfo: null as null | Product,
  loading: false,
  fail: '',
}

export const productInfoReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'PRODUCT_INFO_REQUEST':
      return { ...initialState, loading: true }
    case 'PRODUCT_INFO_SUCCESS':
      return { ...initialState, productInfo: action.payload }
    case 'PRODUCT_INFO_FAIL':
      return { ...initialState, fail: action.payload }
    case 'PRODUCT_INFO_RESET':
      return { ...initialState }
    default:
      return state
  }
}

export const actions = {
  request: () => ({ type: 'PRODUCT_INFO_REQUEST' as const }),
  success: (product: Product) => ({ type: 'PRODUCT_INFO_SUCCESS' as const, payload: product }),
  fail: (errMessage: string) => ({ type: 'PRODUCT_INFO_FAIL' as const, payload: errMessage }),
  reset: () => ({ type: 'PRODUCT_INFO_RESET' as const }),
}

export function productInfoThunk(productId: string): ThunkType {
  return async (dispatch) => {
    try {
      dispatch(actions.request())
      const { data } = await API.admin.getSingleProduct(productId)
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
