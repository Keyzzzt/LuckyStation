import { AuthResponse } from '../05_Types/APIResponse'
import { API } from '../06_Services/API'
import { BaseThunkType, InferActionTypes } from '../05_Types/01_Base'
import { getCookie } from '../04_Utils/getCookie'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  id: null as string | null,
  email: null as string | null,
  isActivated: false,
  isAdmin: false,
  isAuth: false,
  loading: false,
  message: '',
  error: '',
}

export const authReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
    case 'REGISTER_REQUEST':
    case 'LOGOUT_REQUEST':
    case 'AUTH_REQUEST':
      return { ...state, loading: true }

    case 'LOGIN_SUCCESS':
    case 'AUTH_SUCCESS':
      return { ...state, loading: false, isAuth: true, ...action.payload.user, message: action.payload.message, error: '' }

    case 'REGISTER_SUCCESS':
      return { ...state, loading: false, message: action.payload }

    case 'LOGOUT_SUCCESS':
      return { ...initialState, message: action.payload }

    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
    case 'AUTH_FAIL':
      return { ...initialState, error: action.payload }
    default:
      return state
  }
}

export const actions = {
  loginRequestAC: () => ({ type: 'LOGIN_REQUEST' as const }),
  loginSuccessAC: (data: AuthResponse) => ({ type: 'LOGIN_SUCCESS' as const, payload: data }),
  loginFailAC: (errMessage: string) => ({ type: 'LOGIN_FAIL' as const, payload: errMessage }),

  registerRequestAC: () => ({ type: 'REGISTER_REQUEST' as const }),
  registerSuccessAC: (message: string) => ({ type: 'REGISTER_SUCCESS' as const, payload: message }),
  registerFailAC: (errMessage: string) => ({ type: 'REGISTER_FAIL' as const, payload: errMessage }),

  logoutRequestAC: () => ({ type: 'LOGOUT_REQUEST' as const }),
  logoutSuccessAC: (message: string) => ({ type: 'LOGOUT_SUCCESS' as const, payload: message }),
  logoutFailAC: (errMessage: string) => ({ type: 'LOGOUT_FAIL' as const, payload: errMessage }),

  authenticateRequestAC: () => ({ type: 'AUTH_REQUEST' as const }),
  authenticateSuccessAC: (data: AuthResponse) => ({ type: 'AUTH_SUCCESS' as const, payload: data }),
  authenticateFailAC: (errMessage: string) => ({ type: 'AUTH_FAIL' as const, payload: errMessage }),
}

export const userThunk = {
  loginUserThunk:
    (email: string, password: string): ThunkType =>
    async (dispatch, getState) => {
      try {
        dispatch(actions.loginRequestAC())
        const { data } = await API.auth.login(email, password)
        if (data.resultCode === 1) {
          dispatch(actions.loginSuccessAC(data))
          localStorage.setItem('token', data.accessToken)
        } else {
          dispatch(actions.loginFailAC(data.message))
        }
      } catch (error: any) {
        console.log(error)
      }
    },
  registerUserThunk:
    (email: string, password: string): ThunkType =>
    async (dispatch, getState) => {
      try {
        dispatch(actions.registerRequestAC())
        const { data } = await API.auth.registration(email, password)
        if (data.resultCode === 1) {
          dispatch(actions.registerSuccessAC(data.message))
        }
      } catch (error: any) {
        dispatch(actions.registerFailAC(error.message))
        console.log(error)
      }
    },
  logoutUserThunk: (): ThunkType => async (dispatch, getState) => {
    try {
      dispatch(actions.logoutRequestAC())
      const { data } = await API.auth.logout()

      dispatch(actions.logoutSuccessAC(data.message))
      localStorage.removeItem('token')
    } catch (error: any) {
      dispatch(actions.logoutFailAC(error.message))
    }
  },
  authenticateThunk: (): ThunkType => async (dispatch, getState) => {
    try {
      dispatch(actions.authenticateRequestAC())
      const { data } = await API.auth.authenticate()
      console.log(data)
      dispatch(actions.authenticateSuccessAC(data))
      localStorage.setItem('token', data.accessToken)
    } catch (error: any) {
      console.log(error)
      dispatch(actions.authenticateFailAC(error.message))
    }
  },
}
