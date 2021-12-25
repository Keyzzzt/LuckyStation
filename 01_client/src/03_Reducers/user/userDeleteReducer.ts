import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  success: false,
  loading: false,
  error: null as string | null, // TODO: Сделать массивом строк?
}

export const userDeleteReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'USER_DELETE_REQUEST':
      return { loading: true, success: false, error: null }
    case 'USER_DELETE_SUCCESS':
      return { loading: false, success: true, error: null }
    case 'USER_DELETE_FAIL':
      return { loading: false, success: false, error: action.payload }
    case 'USER_DELETE_RESET':
      return { loading: false, success: false, error: null }
    default:
      return state
  }
}

export const actions = {
  deleteUserRequestAC: () => ({ type: 'USER_DELETE_REQUEST' as const }),
  deleteUserSuccessAC: () => ({ type: 'USER_DELETE_SUCCESS' as const }),
  deleteUserFailAC: (errMessage: string) => ({ type: 'USER_DELETE_FAIL' as const, payload: errMessage }),
  deleteUserResetAC: () => ({ type: 'USER_DELETE_RESET' as const }),
}

export function userDeleteThunk(userId: string): ThunkType {
  return async function (dispatch, getState) {
    try {
      dispatch(actions.deleteUserRequestAC())
      await API.admin.deleteUser(userId)
      dispatch(actions.deleteUserSuccessAC())
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.deleteUserFailAC(errMsg))
        return
      }
      dispatch(actions.deleteUserFailAC(error))
    }
  }
}
