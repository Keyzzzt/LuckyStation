import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  createdProduct: null as null | any,
  success: false,
  loading: false,
  error: '',
}

export const createProductReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'CREATE_PRODUCT_REQUEST':
      return { ...initialState, loading: true }

    case 'CREATE_PRODUCT_SUCCESS':
      return { ...initialState, success: true, createdProduct: action.payload }

    case 'CREATE_PRODUCT_FAIL':
      return { ...initialState, error: action.payload }
    case 'CREATE_PRODUCT_RESET':
      return { ...initialState }
    default:
      return state
  }
}

export const actions = {
  createProductRequestAC: () => ({ type: 'CREATE_PRODUCT_REQUEST' as const }),
  createProductSuccessAC: (product: any) => ({ type: 'CREATE_PRODUCT_SUCCESS' as const, payload: product }),
  createProductFailAC: (errMessage: string) => ({ type: 'CREATE_PRODUCT_FAIL' as const, payload: errMessage }),
  createProductResetAC: () => ({ type: 'CREATE_PRODUCT_RESET' as const }),
}

export function createProductThunk(product: any): ThunkType {
  return async (dispatch) => {
    try {
      dispatch(actions.createProductRequestAC())
      const { data } = await API.admin.createProduct(product)
      dispatch(actions.createProductSuccessAC(data))
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.createProductFailAC(errMsg))
        return
      }
      dispatch(actions.createProductFailAC(error))
    }
  }
}
