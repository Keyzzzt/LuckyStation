import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { UserResponseType } from '../../05_Types/ResponseTypes'
import { Dispatch } from 'redux'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

export const initialState = {
  user: null as null | UserResponseType,
  loading: false,
  fail: '',
}

export const getUserReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'GET_USER_REQUEST':
      return { ...state, user: null, fail: '', loading: true, }
    case 'GET_USER_SUCCESS':
      return { ...state, user: action.payload, loading: false, }
    case 'GET_USER_FAIL':
      return { ...state, fail: action.payload, loading: false, }
    default:
      return state
  }
}

export const actions = {
  requestAC: () => ({ type: 'GET_USER_REQUEST' as const }),
  successAC: (user: UserResponseType) => ({ type: 'GET_USER_SUCCESS' as const, payload: user }),
  failAC: (errMessage: string) => ({ type: 'GET_USER_FAIL' as const, payload: errMessage }),
}

export function getUserThunk(userId: string): ThunkType {
  return async function (dispatch: Dispatch) {
    try {
      dispatch(actions.requestAC())
      const { data } = await API.admin.getUser(userId)
      dispatch(actions.successAC(data))
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.failAC(errMsg))
        return
      }
      dispatch(actions.failAC(error))
    }
  }
}
