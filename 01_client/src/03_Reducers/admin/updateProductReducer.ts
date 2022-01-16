import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  updatedProduct: null as null | any,
  loading: false,
  error: '',
}

export const updateProductReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'UPDATE_PRODUCT_REQUEST':
      return { ...initialState, loading: true }
    case 'UPDATE_PRODUCT_SUCCESS':
      return { ...initialState, updatedProduct: action.payload }
    case 'UPDATE_PRODUCT_FAIL':
      return { ...initialState, error: action.payload }
    case 'UPDATE_PRODUCT_RESET':
      return { ...initialState }
    default:
      return state
  }
}

export const actions = {
  updateProductRequestAC: () => ({ type: 'UPDATE_PRODUCT_REQUEST' as const }),
  updateProductSuccessAC: (product: any) => ({ type: 'UPDATE_PRODUCT_SUCCESS' as const, payload: product }),
  updateProductFailAC: (errMessage: string) => ({ type: 'UPDATE_PRODUCT_FAIL' as const, payload: errMessage }),
  updateProductResetAC: () => ({ type: 'UPDATE_PRODUCT_RESET' as const }),
}

export function updateProductThunk(productId: string, product: any): ThunkType {
  return async (dispatch) => {
    try {
      dispatch(actions.updateProductRequestAC())
      const { data } = await API.admin.updateProduct(productId, product)
      dispatch(actions.updateProductSuccessAC(data))
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.updateProductFailAC(errMsg))
        return
      }
      dispatch(actions.updateProductFailAC(error))
    }
  }
}
