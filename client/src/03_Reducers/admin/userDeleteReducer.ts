import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { Dispatch } from 'redux'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  success: false,
  loading: false,
  fail: '',
}

export const userDeleteReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'USER_DELETE_REQUEST':
      return { ...state, success: false, fail: '', loading: true }
    case 'USER_DELETE_SUCCESS':
      return { ...state, success: true, loading: false }
    case 'USER_DELETE_FAIL':
      return { ...state, fail: action.payload, loading: false }

    default:
      return state
  }
}

export const actions = {
  requestAC: () => ({ type: 'USER_DELETE_REQUEST' as const }),
  successAC: () => ({ type: 'USER_DELETE_SUCCESS' as const }),
  failAC: (errMessage: string) => ({ type: 'USER_DELETE_FAIL' as const, payload: errMessage }),
}

export function userDeleteThunk(userId: string): ThunkType {
  return async function (dispatch: Dispatch) {
    try {
      dispatch(actions.requestAC())
      await API.admin.deleteUser(userId)
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
