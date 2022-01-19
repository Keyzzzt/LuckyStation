import { API } from '../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../05_Types/01_Base'
import { userInfoThunk } from './user/userInfoReducer'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  success: false,
  loading: false,
  fail: '',
}

export const loginReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return { ...initialState, loading: true }
    case 'LOGIN_SUCCESS':
      return { ...initialState, success: true }
    case 'LOGIN_FAIL':
      return { ...initialState, fail: action.payload }
    case 'LOGIN_RESET':
      return { ...initialState }
    default:
      return state
  }
}

export const actions = {
  request: () => ({ type: 'LOGIN_REQUEST' as const }),
  success: () => ({ type: 'LOGIN_SUCCESS' as const }),
  fail: (errMessage: string) => ({ type: 'LOGIN_FAIL' as const, payload: errMessage }),
  reset: () => ({ type: 'LOGIN_RESET' as const }),
}

export function loginThunk(email: string, password: string): ThunkType {
  return async function (dispatch) {
    try {
      dispatch(actions.request())
      const { data } = await API.auth.login(email, password)

      dispatch(actions.success())
      localStorage.setItem('token', data.accessToken)
      dispatch(userInfoThunk())
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.fail(errMsg))
        return
      }
      dispatch(actions.fail(error))
    }
  }
}
