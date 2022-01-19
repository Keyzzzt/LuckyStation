import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'

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
      return { ...initialState, loading: true }
    case 'UPDATE_PRODUCT_SUCCESS':
      return { ...initialState, updatedProduct: action.payload }
    case 'UPDATE_PRODUCT_FAIL':
      return { ...initialState, fail: action.payload }
    case 'UPDATE_PRODUCT_RESET':
      return { ...initialState }
    default:
      return state
  }
}

export const actions = {
  request: () => ({ type: 'UPDATE_PRODUCT_REQUEST' as const }),
  success: (product: any) => ({ type: 'UPDATE_PRODUCT_SUCCESS' as const, payload: product }),
  fail: (errMessage: string) => ({ type: 'UPDATE_PRODUCT_FAIL' as const, payload: errMessage }),
  reset: () => ({ type: 'UPDATE_PRODUCT_RESET' as const }),
}

export function updateProductThunk(productId: string, product: any): ThunkType {
  return async (dispatch) => {
    try {
      dispatch(actions.request())
      const { data } = await API.admin.updateProduct(productId, product)
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
