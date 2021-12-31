import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { Product } from '../../05_Types/APIResponse'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  products: null as null | Product[],
  loading: false,
  error: null as string | null,
}

export const productListReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'PRODUCT_LIST_REQUEST':
      return { ...state, loading: true, error: null }

    case 'PRODUCT_LIST_SUCCESS':
      return { ...state, loading: false, error: null, products: action.payload }

    case 'PRODUCT_LIST_FAIL':
      return { ...state, loading: false, error: action.payload }

    default:
      return state
  }
}

export const actions = {
  getProductsRequestAC: () => ({ type: 'PRODUCT_LIST_REQUEST' as const }),
  getProductsSuccessAC: (data: Product[]) => ({ type: 'PRODUCT_LIST_SUCCESS' as const, payload: data }),
  getProductsFailAC: (errMessage: string) => ({ type: 'PRODUCT_LIST_FAIL' as const, payload: errMessage }),
}

export function productListThunk(page: number, limit: number): ThunkType {
  return async (dispatch, getState) => {
    try {
      dispatch(actions.getProductsRequestAC())
      const { data } = await API.admin.getProducts(page, limit)

      dispatch(actions.getProductsSuccessAC(data.items))
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.getProductsFailAC(errMsg))
        return
      }
      dispatch(actions.getProductsFailAC(error))
    }
  }
}
