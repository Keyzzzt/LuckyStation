import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  success: false,
  loading: false,
  fail: '',
}

export const registerReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'REGISTER_REQUEST':
      return { ...state, success: false, fail: '', loading: true }
    case 'REGISTER_SUCCESS':
      return { ...state, success: true, loading: false }
    case 'REGISTER_FAIL':
      return { ...state, fail: action.payload, loading: false }
    default:
      return state
  }
}

export const actions = {
  requestAC: () => ({ type: 'REGISTER_REQUEST' as const }),
  successAC: () => ({ type: 'REGISTER_SUCCESS' as const }),
  failAC: (errMessage: string) => ({ type: 'REGISTER_FAIL' as const, payload: errMessage }),
}

export function registerTC(email: string, password: string): ThunkType {
  return async function(dispatch) {
    try {
      dispatch(actions.requestAC())
      await API.auth.registration(email, password)
      dispatch(actions.successAC())
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors.length > 0) {
        const errMsg = errors.map(e => e.msg).join('; ')
        dispatch(actions.failAC(errMsg))
        return
      }
      dispatch(actions.failAC(error))
    }
  }
}
