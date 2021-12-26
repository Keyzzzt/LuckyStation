import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { User } from '../../05_Types/APIResponse'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  userInfo: null as null | User,
  loading: false,
  error: null as string | null,
}

export const userInfoReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'USER_INFO_REQUEST':
      return { ...initialState, loading: true }
    case 'USER_INFO_SUCCESS':
      return { ...initialState, userInfo: action.payload }
    case 'USER_INFO_FAIL':
      return { ...initialState, error: action.payload }
    case 'LOGOUT_SUCCESS':
      return { ...initialState }
    default:
      return state
  }
}

export const actions = {
  userInfoRequestAC: () => ({ type: 'USER_INFO_REQUEST' as const }),
  userInfoSuccessAC: (data: User) => ({ type: 'USER_INFO_SUCCESS' as const, payload: data }),
  userInfoFailAC: (errMessage: string) => ({ type: 'USER_INFO_FAIL' as const, payload: errMessage }),

  logoutSuccessAC: () => ({ type: 'LOGOUT_SUCCESS' as const }),
  logoutFailAC: (errMessage: string) => ({ type: 'LOGOUT_FAIL' as const, payload: errMessage }),
}

export function userInfoThunk(userId: string): ThunkType {
  return async function (dispatch) {
    try {
      dispatch(actions.userInfoRequestAC())
      const { data } = await API.admin.getSingleUser(userId)
      dispatch(actions.userInfoSuccessAC(data))
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.userInfoFailAC(errMsg))
        return
      }
      dispatch(actions.userInfoFailAC(error))
    }
  }
}

export function logoutThunk(): ThunkType {
  return async function (dispatch) {
    try {
      await API.auth.logout()
      dispatch(actions.logoutSuccessAC())
      localStorage.removeItem('token')
    } catch (err: any) {
      alert('Logout Fail')
    }
  }
}

export function authenticateThunk(): ThunkType {
  return async function (dispatch) {
    try {
      const { data } = await API.auth.authenticate()
      dispatch(userInfoThunk(data.id))
      localStorage.setItem('token', data.accessToken)
    } catch (err: any) {
      console.log('Authentication failed, please log in.')
    }
  }
}
