import { userInfoThunk } from '../user/userInfoReducer'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { API } from '../../API'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  success: false,
  loading: false,
  fail: '',
}

export const signInReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return { ...state, success: false, fail: '', loading: true }
    case 'LOGIN_SUCCESS':
      return { ...state, success: true, loading: false }
    case 'LOGIN_FAIL':
      return { ...state, fail: action.payload, loading: false }
    default:
      return state
  }
}

export const actions = {
  requestAC: () => ({ type: 'LOGIN_REQUEST' as const }),
  successAC: () => ({ type: 'LOGIN_SUCCESS' as const }),
  failAC: (errMessage: string) => ({ type: 'LOGIN_FAIL' as const, payload: errMessage }),
}

export function signInTC(email: string, password: string): ThunkType {
  return async function(dispatch) {
    try {
      dispatch(actions.requestAC())
      const { data } = await API.auth.signIn(email, password)
      dispatch(actions.successAC())
      localStorage.setItem('token', data.accessToken)
      dispatch(userInfoThunk())
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.failAC(errMsg))
        return
      }
      dispatch(actions.failAC(error))
    }
  }
}
