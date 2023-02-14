import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  success: false,
  loading: false,
  fail: '',
}

export const toggleAdminStatusReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'UPDATE_PROFILE_BY_ADMIN_REQUEST':
      return { ...state, success: false, fail: '', loading: true }
    case 'UPDATE_PROFILE_BY_ADMIN_SUCCESS':
      return { ...state, success: true, loading: false }
    case 'UPDATE_PROFILE_BY_ADMIN_FAIL':
      return { ...state, fail: action.payload, loading: false }
    default:
      return state
  }
}

export const actions = {
  requestAC: () => ({ type: 'UPDATE_PROFILE_BY_ADMIN_REQUEST' as const }),
  successAC: () => ({ type: 'UPDATE_PROFILE_BY_ADMIN_SUCCESS' as const }),
  failAC: (errMessage: string) => ({ type: 'UPDATE_PROFILE_BY_ADMIN_FAIL' as const, payload: errMessage }),
}

export type ToggleAdminStatusType = {
  isAdmin: boolean
}
export function toggleAdminStatusTC(userId: string, status: ToggleAdminStatusType): ThunkType {
  return async function (dispatch) {
    try {
      dispatch(actions.requestAC())
      await API.admin.toggleAdminStatus(userId, status)
      dispatch(actions.successAC())
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
