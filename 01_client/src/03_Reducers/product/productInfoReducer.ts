import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { Product } from '../../05_Types/APIResponse'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  productInfo: null as null | Product,
  loading: false,
  error: null as string | null,
}

export const productInfoReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'PRODUCT_INFO_REQUEST':
      return { ...initialState, loading: true }

    case 'PRODUCT_INFO_SUCCESS':
      return { ...initialState, productInfo: action.payload }

    case 'PRODUCT_INFO_FAIL':
      return { ...initialState, error: action.payload }

    default:
      return state
  }
}

export const actions = {
  getProductRequestAC: () => ({ type: 'PRODUCT_INFO_REQUEST' as const }),
  getProductSuccessAC: (product: Product) => ({ type: 'PRODUCT_INFO_SUCCESS' as const, payload: product }),
  getProductFailAC: (errMessage: string) => ({ type: 'PRODUCT_INFO_FAIL' as const, payload: errMessage }),
}

export function productInfoThunk(productId: string): ThunkType {
  return async (dispatch, getState) => {
    try {
      dispatch(actions.getProductRequestAC())
      const { data } = await API.admin.getSingleProduct(productId)
      dispatch(actions.getProductSuccessAC(data))
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.getProductFailAC(errMsg))
        return
      }
      dispatch(actions.getProductFailAC(error))
    }
  }
}
