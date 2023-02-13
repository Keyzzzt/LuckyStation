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
  productsList: null as null | ProductResponseType[],
  loading: false,
  next: null as null | NextPage,
  prev: null as null | PrevPage,
  totalPages: 0,
  fail: '',
}

export const productsListReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'PRODUCT_LIST_REQUEST':
      return {
        ...state,
        productsList:null,
        next: null,
        prev: null,
        totalPages: 0,
        fail: '',
        loading: true
      }
    case 'PRODUCT_LIST_SUCCESS':
      return {
        ...state,
        productsList: action.payload.items,
        next: action.payload.next,
        prev: action.payload.prev,
        totalPages: action.payload.totalPages,
        loading: false
      }
    case 'PRODUCT_LIST_FAIL':
      return { ...state, fail: action.payload, loading: false }
    default:
      return state
  }
}

export const actions = {
  requestAC: () => ({ type: 'PRODUCT_LIST_REQUEST' as const}),
  successAC: (data: any) => ({ type: 'PRODUCT_LIST_SUCCESS' as const, payload: data }),
  failAC: (errMessage: string) => ({ type: 'PRODUCT_LIST_FAIL' as const, payload: errMessage }),
}

export function productListTC(keyword = '', page: number, limit: number): ThunkType {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(actions.requestAC())
      const { data } = await API.admin.getProducts(keyword, page, limit)
      dispatch(actions.successAC(data))
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.failAC(errMsg))
        return
      }
      dispatch(actions.failAC(error))
    }
  }
}
