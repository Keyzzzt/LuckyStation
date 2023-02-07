import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { ProductResponseType } from '../../05_Types/ResponseTypes'
import { Dispatch } from 'redux'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>
type PrevPage = {
  limit: number
  prevPage: number
}
type NextPage = {
  limit: number
  nextPage: number
}

const initialState = {
  products: null as null | ProductResponseType[],
  next: null as null | NextPage,
  prev: null as null | PrevPage,
  totalPages: 0,
  fail: '',
}

export const productsListReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'PRODUCT_LIST_SUCCESS':
      return {
        ...initialState,
        products: action.payload.items,
        next: action.payload.next,
        prev: action.payload.prev,
        totalPages: action.payload.totalPages,
      }
    case 'PRODUCT_LIST_FAIL':
      return { ...initialState, fail: action.payload }
    default:
      return state
  }
}

export const actions = {
  success: (data: any) => ({ type: 'PRODUCT_LIST_SUCCESS' as const, payload: data }),
  fail: (errMessage: string) => ({ type: 'PRODUCT_LIST_FAIL' as const, payload: errMessage }),
}

export function productListThunk(keyword = '', page: number, limit: number): ThunkType {
  return async (dispatch: Dispatch) => {
    try {
      const { data } = await API.admin.getProducts(keyword, page, limit)
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
