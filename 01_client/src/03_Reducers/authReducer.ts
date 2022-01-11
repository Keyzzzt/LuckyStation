import { API } from '../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../05_Types/01_Base'
import { userInfoThunk } from './user/userInfoReducer'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  loginSuccess: false,
  loginLoading: false,
  loginFail: '',
}

export const authReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return { ...initialState, loginLoading: true }
    case 'LOGIN_SUCCESS':
      return { ...initialState, loginSuccess: true }
    case 'LOGIN_FAIL':
      return { ...initialState, loginFail: action.payload }
    case 'LOGIN_RESET':
      return { ...initialState }
    default:
      return state
  }
}

export const actions = {
  loginRequestAC: () => ({ type: 'LOGIN_REQUEST' as const }),
  loginSuccessAC: () => ({ type: 'LOGIN_SUCCESS' as const }),
  loginFailAC: (errMessage: string) => ({ type: 'LOGIN_FAIL' as const, payload: errMessage }),
  loginResetAC: () => ({ type: 'LOGIN_RESET' as const }),
}

export const authThunk = {
  login:
    (email: string, password: string): ThunkType =>
    async (dispatch) => {
      try {
        dispatch(actions.loginRequestAC())
        const { data } = await API.auth.login(email, password)

        dispatch(actions.loginSuccessAC())
        localStorage.setItem('token', data.accessToken)
        dispatch(userInfoThunk())
      } catch (err: any) {
        const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
        if (errors.length > 0) {
          const errMsg = errors.map((e) => e.msg).join('; ')
          dispatch(actions.loginFailAC(errMsg))
          return
        }
        dispatch(actions.loginFailAC(error))
      }
    },
}
