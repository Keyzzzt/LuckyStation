import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { User } from '../../05_Types/APIResponse'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

export const initialState = {
  user: null as null | User,
  loading: false,
  fail: '',
}

export const getUserReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'GET_USER_REQUEST':
      return { ...initialState, loading: true }
    case 'GET_USER_SUCCESS':
      return { ...initialState, user: action.payload }
    case 'GET_USER_FAIL':
      return { ...initialState, fail: action.payload }
    case 'GET_USER_RESET':
      return { ...initialState }
    default:
      return state
  }
}

export const actions = {
  request: () => ({ type: 'GET_USER_REQUEST' as const }),
  success: (user: any) => ({ type: 'GET_USER_SUCCESS' as const, payload: user }),
  fail: (errMessage: string) => ({ type: 'GET_USER_FAIL' as const, payload: errMessage }),
  reset: () => ({ type: 'GET_USER_RESET' as const }),
}

export function getUserThunk(userId: string): ThunkType {
  return async function (dispatch) {
    try {
      dispatch(actions.request())
      const { data } = await API.admin.getUser(userId)
      dispatch(actions.success(data))
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.fail(errMsg))
        return
      }
      dispatch(actions.fail(error))
    }
  }
}
