import { API } from '../../API'
import { BaseThunkType, InferActionTypes } from '../../05_Types/01_Base'
import { actions as reset } from '../authReducer'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  success: false,
  loading: false,
  error: null as string | null, // TODO: Сделать массивом строк?
}

export const userLogoutReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'LOGOUT_REQUEST':
      return { loading: true, error: null, success: false }
    case 'LOGOUT_SUCCESS':
      return { loading: false, error: null, success: true }
    case 'LOGOUT_FAIL':
      return { loading: false, error: action.payload, success: false }
    default:
      return state
  }
}

export const actions = {
  logoutRequestAC: () => ({ type: 'LOGOUT_REQUEST' as const }),
  logoutSuccessAC: () => ({ type: 'LOGOUT_SUCCESS' as const }),
  logoutFailAC: (errMessage: string) => ({ type: 'LOGOUT_FAIL' as const, payload: errMessage }),
}

export function logoutThunk(): ThunkType {
  return async function (dispatch) {
    try {
      dispatch(actions.logoutRequestAC())
      await API.auth.logout()
      dispatch(actions.logoutSuccessAC())
      localStorage.removeItem('token')
    } catch (err: any) {
      dispatch(actions.logoutFailAC(err.message))
    }
  }
}
