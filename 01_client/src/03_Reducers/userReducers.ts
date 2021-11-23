import { API } from '../06_Services/API'
import {
  AUTH_FAIL,
  AUTH_REQUEST,
  AUTH_SUCCESS,
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_FAIL,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  REGISTER_FAIL,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
} from '../constants'
import { BaseThunkType, InferActionTypes } from '../Types'

type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>
type ThunkType = BaseThunkType<ActionType>

const initialState = {
  id: null as string | null,
  email: null as string | null,
  name: null as string | null,
  isActivated: false,
  isAdmin: false,
  isAuth: false,
  loading: false,
  message: '',
}

export const authReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
    case LOGOUT_REQUEST:
    case AUTH_REQUEST:
      return { ...state, loading: true }
    case LOGIN_SUCCESS:
    case AUTH_SUCCESS:
      return { ...state, loading: false, isAuth: true, ...action.payload.data, message: action.payload.message }
    case REGISTER_SUCCESS:
      return { ...state, loading: false, message: action.payload }
    case LOGOUT_SUCCESS:
      return {
        id: null,
        email: null,
        name: null,
        isActivated: false,
        isAdmin: false,
        isAuth: false,
        loading: false,
        message: action.payload,
      }

    case LOGIN_FAIL:
    case REGISTER_FAIL:
    case AUTH_FAIL:
      return { id: null, email: null, name: null, isActivated: false, isAdmin: false, isAuth: false, loading: false, message: action.payload }
    default:
      return state
  }
}

const actions = {
  loginRequestAC: () => ({ type: LOGIN_REQUEST }),
  loginSuccessAC: (data: {}) => ({ type: LOGIN_SUCCESS, payload: data } as any),
  loginFailAC: (errMessage: string) => ({ type: LOGIN_FAIL, payload: errMessage }),

  registerRequestAC: () => ({ type: REGISTER_REQUEST }),
  registerSuccessAC: (message: string) => ({ type: REGISTER_SUCCESS, payload: message }),
  registerFailAC: (errMessage: string) => ({ type: REGISTER_FAIL, payload: errMessage }),

  logoutRequestAC: () => ({ type: LOGOUT_REQUEST }),
  logoutSuccessAC: (message: string) => ({ type: LOGOUT_SUCCESS, payload: message }),
  logoutFailAC: (errMessage: string) => ({ type: LOGOUT_FAIL, payload: errMessage }),

  authenticateRequestAC: () => ({ type: AUTH_REQUEST }),
  authenticateSuccessAC: (data: any) => ({ type: AUTH_SUCCESS, payload: data }),
  authenticateFailAC: (errMessage: string) => ({ type: AUTH_FAIL, payload: errMessage }),
}

export const loginUserThunk =
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
  }

export const registerUserThunk =
  (name: string, email: string, password: string): ThunkType =>
  async (dispatch, getState) => {
    try {
      dispatch(actions.registerRequestAC())
      const { data } = await API.auth.registration(name, email, password)
      if (data.resultCode === 1) {
        dispatch(actions.registerSuccessAC(data.message))
      }
    } catch (error: any) {
      dispatch(actions.registerFailAC(error.message))
      console.log(error)
    }
  }
export const logoutUserThunk = (): ThunkType => async (dispatch, getState) => {
  try {
    dispatch(actions.logoutRequestAC())
    const { data } = await API.auth.logout()
    if (data.resultCode === 1) {
      dispatch(actions.logoutSuccessAC(data.message))
      localStorage.removeItem('token')
    } else {
      dispatch(actions.logoutFailAC(data.message))
    }
  } catch (error) {
    console.log(error)
  }
}

export const authenticate = (): ThunkType => async (dispatch, getState) => {
  try {
    dispatch(actions.authenticateRequestAC())
    const { data } = await API.auth.authenticate()

    if (data.resultCode === 1) {
      dispatch(actions.authenticateSuccessAC(data))
      localStorage.setItem('token', data.accessToken)
    } else {
      dispatch(actions.authenticateFailAC(data.message))
    }
  } catch (error: any) {
    console.log(error)
    dispatch(actions.authenticateFailAC(error.message as string))
  }
}
