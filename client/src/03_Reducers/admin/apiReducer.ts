import { API } from '../../API'
import { BaseThunkType, InferActionTypes, RequestBodyValidationErrorsType } from '../../05_Types/01_Base'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  apiInfo: null as null | any,
  loading: false,
  fail: '',
}

export const apiReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'API_REQUEST':
      return { ...state, apiInfo: null, fail: '', loading: true }
    case 'API_SUCCESS':
      return { ...state, apiInfo: action.payload, loading: false }
    case 'API_FAIL':
      return { ...state, fail: action.payload, loading: false }
    default:
      return state
  }
}

export const actions = {
  requestAC: () => ({ type: 'API_REQUEST' as const}),
  successAC: (data: any) => ({ type: 'API_SUCCESS' as const, payload: data }),
  failAC: (errMessage: string) => ({ type: 'API_FAIL' as const, payload: errMessage }),
}

export function apiTC(): ThunkType {
  return async function (dispatch) {
    try {
      const { data } = await API.admin.getApiInfo()
      dispatch(actions.successAC(data))
    } catch (err: any) {
      const { errors, fail }: { errors: RequestBodyValidationErrorsType[], fail: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map(e => e.msg).join('; ')
        dispatch(actions.failAC(errMsg))
        return
      }
      dispatch(actions.failAC(fail))
    }
  }
}
