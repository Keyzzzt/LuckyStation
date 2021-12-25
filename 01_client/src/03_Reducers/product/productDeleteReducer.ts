import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  success: false,
  loading: false,
  error: null as string | null, // TODO: Сделать массивом строк?
}

export const productDeleteReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'PRODUCT_DELETE_REQUEST':
      return { ...initialState, loading: true }

    case 'PRODUCT_DELETE_SUCCESS':
      return { ...initialState, success: true }

    case 'PRODUCT_DELETE_FAIL':
      return { ...initialState, error: action.payload }
    case 'PRODUCT_DELETE_RESET':
      return { ...initialState }
    default:
      return state
  }
}

export const actions = {
  productDeleteRequestAC: () => ({ type: 'PRODUCT_DELETE_REQUEST' as const }),
  productDeleteSuccessAC: () => ({ type: 'PRODUCT_DELETE_SUCCESS' as const }),
  productDeleteFailAC: (errMessage: string) => ({ type: 'PRODUCT_DELETE_FAIL' as const, payload: errMessage }),
  productDeleteResetAC: () => ({ type: 'PRODUCT_DELETE_RESET' as const }),
}

export function productDeleteThunk(productId: string): ThunkType {
  return async (dispatch, getState) => {
    try {
      dispatch(actions.productDeleteRequestAC())
      await API.admin.deleteProduct(productId)
      dispatch(actions.productDeleteSuccessAC())
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.productDeleteFailAC(errMsg))
        return
      }
      dispatch(actions.productDeleteFailAC(error))
    }
  }
}
