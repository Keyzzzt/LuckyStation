import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { Product } from '../../05_Types/APIResponse'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>
// TODO: Написать типы по умному
// todo products : null as null | Product[],
type PrevPage = {
  limit: number
  prevPage: number
}
type NextPage = {
  limit: number
  nextPage: number
}

const initialState = {
  products: [] as [] | Product[],
  next: null as null | NextPage,
  prev: null as null | PrevPage,
  totalPages: 0,
  loading: false,
  error: '',
}

export const productListReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'PRODUCT_LIST_REQUEST':
      return { ...initialState, loading: true }

    case 'PRODUCT_LIST_SUCCESS':
      return {
        ...initialState,
        products: action.payload.items,
        next: action.payload.next,
        prev: action.payload.prev,
        totalPages: action.payload.totalPages,
      }

    case 'PRODUCT_LIST_FAIL':
      return { ...initialState, error: action.payload }

    default:
      return state
  }
}

export const actions = {
  getProductsRequestAC: () => ({ type: 'PRODUCT_LIST_REQUEST' as const }),
  getProductsSuccessAC: (data: any) => ({ type: 'PRODUCT_LIST_SUCCESS' as const, payload: data }),
  getProductsFailAC: (errMessage: string) => ({ type: 'PRODUCT_LIST_FAIL' as const, payload: errMessage }),
}

export function productListThunk(keyword = '', page: number, limit: number): ThunkType {
  return async (dispatch) => {
    try {
      dispatch(actions.getProductsRequestAC())
      const { data } = await API.admin.getProducts(keyword, page, limit)

      dispatch(actions.getProductsSuccessAC(data))
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
