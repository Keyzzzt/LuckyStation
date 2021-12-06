import { AuthResponse } from '../05_Types/APIResponse'
import { API } from '../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../05_Types/01_Base'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  id: null as string | null,
  email: null as string | null,
  isActivated: false,
  isAdmin: false,
  isAuth: false,
  isSubscribed: false,
  favorite: [] as string[],
  loading: false,
  error: null as string | null, // TODO: Сделать массивом строк?
}

export const authReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
    case 'REGISTER_REQUEST':
    case 'LOGOUT_REQUEST':
    case 'AUTH_REQUEST':
      return { ...state, loading: true, error: null }

    case 'LOGIN_SUCCESS':
    case 'AUTH_SUCCESS':
      return { ...state, loading: false, isAuth: true, ...action.payload, error: null }

    case 'REGISTER_SUCCESS':
      return { ...state, loading: false, error: null }

    case 'LOGOUT_SUCCESS':
      return { ...initialState, loading: false, error: null }

    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
    case 'AUTH_FAIL':
      return { ...initialState, loading: false, error: action.payload }
    default:
      return state
  }
}

export const actions = {
  loginRequestAC: () => ({ type: 'LOGIN_REQUEST' as const }),
  loginSuccessAC: (data: AuthResponse) => ({ type: 'LOGIN_SUCCESS' as const, payload: data.user }),
  loginFailAC: (errMessage: string) => ({ type: 'LOGIN_FAIL' as const, payload: errMessage }),

  registerRequestAC: () => ({ type: 'REGISTER_REQUEST' as const }),
  registerSuccessAC: () => ({ type: 'REGISTER_SUCCESS' as const }),
  registerFailAC: (errMessage: string) => ({ type: 'REGISTER_FAIL' as const, payload: errMessage }),

  logoutRequestAC: () => ({ type: 'LOGOUT_REQUEST' as const }),
  logoutSuccessAC: () => ({ type: 'LOGOUT_SUCCESS' as const }),
  logoutFailAC: (errMessage: string) => ({ type: 'LOGOUT_FAIL' as const, payload: errMessage }),

  authenticateRequestAC: () => ({ type: 'AUTH_REQUEST' as const }),
  authenticateSuccessAC: (data: AuthResponse) => ({ type: 'AUTH_SUCCESS' as const, payload: data.user }),
  authenticateFailAC: (errMessage: string) => ({ type: 'AUTH_FAIL' as const, payload: errMessage }),
}

export const userThunk = {
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
  register:
    (email: string, password: string): ThunkType =>
    async (dispatch, getState) => {
      try {
        dispatch(actions.registerRequestAC())
        await API.auth.registration(email, password)
        dispatch(actions.registerSuccessAC())
      } catch (err: any) {
        const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data

        if (errors.length > 0) {
          const errMsg = errors.map((e) => e.msg).join('; ') //FIXME: WTF
          dispatch(actions.registerFailAC(errMsg))
          return
        }
        dispatch(actions.registerFailAC(error))
      }
    },
  logout: (): ThunkType => async (dispatch, getState) => {
    try {
      dispatch(actions.logoutRequestAC())
      await API.auth.logout()
      dispatch(actions.logoutSuccessAC())
      localStorage.removeItem('token')
    } catch (err: any) {
      dispatch(actions.logoutFailAC(err.message))
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
        const errMsg = errors.map((e) => e.msg).join('; ') //FIXME: WTF
        dispatch(actions.registerFailAC(errMsg))
        return
      }
      dispatch(actions.registerFailAC(error))
    }
  },
}
