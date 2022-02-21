import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  apiInfo: [] as [] | any,
  fail: '',
}

export const apiReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'API_SUCCESS':
      return { ...initialState, apiInfo: action.payload }
    case 'API_FAIL':
      return { ...initialState, fail: action.payload }
    default:
      return state
  }
}

export const actions = {
  success: (data: any) => ({ type: 'API_SUCCESS' as const, payload: data }),
  fail: (errMessage: string) => ({ type: 'API_FAIL' as const, payload: errMessage }),
}

export function apiThunk(): ThunkType {
  return async function (dispatch) {
    try {
      const { data } = await API.admin.getApiInfo()
      dispatch(actions.success(data))
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map(e => e.msg).join('; ')
        dispatch(actions.fail(errMsg))
        return
      }
      dispatch(actions.fail(error))
    }
  }
}
