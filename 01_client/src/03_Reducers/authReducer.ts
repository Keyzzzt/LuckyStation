import { LoginResponse } from '../05_Types/APIResponse'
import { API } from '../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../05_Types/01_Base'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  id: null as string | null,
  email: null as string | null,
  logo: null as string | null,
  isActivated: false,
  isAdmin: false,
  isAuth: false,
  isSubscribed: false,
  favorite: [] as string[],
  loading: false,
  error: null as string | null,
}

export const authReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
    case 'AUTH_REQUEST':
      return { ...state, loading: true, error: null }

    case 'LOGIN_SUCCESS':
    case 'AUTH_SUCCESS':
      return { ...state, loading: false, isAuth: true, ...action.payload, error: null }

    case 'LOGIN_FAIL':
    case 'AUTH_FAIL':
      return { ...initialState, loading: false, error: action.payload }
    case 'AUTH_RESET':
      return { ...initialState }
    default:
      return state
  }
}

export const actions = {
  loginRequestAC: () => ({ type: 'LOGIN_REQUEST' as const }),
  loginSuccessAC: (data: LoginResponse) => ({ type: 'LOGIN_SUCCESS' as const, payload: data.user }),
  loginFailAC: (errMessage: string) => ({ type: 'LOGIN_FAIL' as const, payload: errMessage }),

  authenticateRequestAC: () => ({ type: 'AUTH_REQUEST' as const }),
  authenticateSuccessAC: (data: LoginResponse) => ({ type: 'AUTH_SUCCESS' as const, payload: data.user }),
  authenticateFailAC: (errMessage: string) => ({ type: 'AUTH_FAIL' as const, payload: errMessage }),
  authenticateResetAC: () => ({ type: 'AUTH_RESET' as const }),
}

export const authThunk = {
  login:
    (email: string, password: string): ThunkType =>
    async (dispatch, getState) => {
      try {
        dispatch(actions.loginRequestAC())
        const { data } = await API.auth.login(email, password)
        dispatch(actions.loginSuccessAC(data))
        localStorage.setItem('token', data.accessToken)
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
  authenticate: (): ThunkType => async (dispatch, getState) => {
    try {
      dispatch(actions.authenticateRequestAC())
      const { data } = await API.auth.authenticate()
      dispatch(actions.authenticateSuccessAC(data))
      localStorage.setItem('token', data.accessToken)
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data

      if (errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.authenticateFailAC(errMsg))
        return
      }
      dispatch(actions.authenticateFailAC(error))
    }
  },
}
