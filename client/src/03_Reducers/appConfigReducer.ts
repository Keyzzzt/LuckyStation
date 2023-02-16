import { API } from '../API'
import { BaseThunkType, InferActionTypes, RequestBodyValidationErrorsType } from '../05_Types/01_Base'
import { ConfigResponseType } from '../05_Types/ResponseTypes'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  appConfig: {} as ConfigResponseType,
  loading: false,
  fail: '',
}

export const appConfigReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'CONFIG_REQUEST':
      return { ...state, fail: '', loading: true }
    case 'CONFIG_SUCCESS':
      return { ...state, appConfig: action.payload, loading: false }
    case 'CONFIG_FAIL':
      return { ...state, fail: action.payload, loading: false }

    default:
      return state
  }
}

export const actions = {
  requestAC: () => ({ type: 'CONFIG_REQUEST' as const }),
  successAC: (config: ConfigResponseType) => ({ type: 'CONFIG_SUCCESS' as const, payload: config }),
  failAC: (errMessage: string) => ({ type: 'CONFIG_FAIL' as const, payload: errMessage }),
}

export function configTC(): ThunkType {
  return async function(dispatch) {
    try {
      dispatch(actions.requestAC())
      const { data } = await API.config.getConfig()
      dispatch(actions.successAC(data))
    } catch (err: any) {
      const { errors, fail }: { errors: RequestBodyValidationErrorsType[], fail: string } = err.response.data
      if (errors.length > 0) {
        const errMsg = errors.map(e => e.msg).join('; ')
        dispatch(actions.failAC(errMsg))
        return
      }
      dispatch(actions.failAC(fail))
    }
  }
}
