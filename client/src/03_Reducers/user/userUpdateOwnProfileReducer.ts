import { API } from '../../API'
import { BaseThunkType, InferActionTypes, RequestBodyValidationErrorsType } from '../../05_Types/01_Base'
import { userInfoThunk } from './userInfoReducer'
import { UpdateProfilePayloadType } from '../../05_Types/ResponseTypes'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  success: false,
  loading: false,
  fail: '',
}

export const userUpdateOwnProfileReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'UPDATE_OWN_PROFILE_REQUEST':
      return { ...state, success: false, fail:'', loading: true }
    case 'UPDATE_OWN_PROFILE_SUCCESS':
      return { ...state, success: true, loading: false }
    case 'UPDATE_OWN_PROFILE_FAIL':
      return { ...state, fail: action.payload, loading: false }

    default:
      return state
  }
}

export const actions = {
  requestAC: () => ({ type: 'UPDATE_OWN_PROFILE_REQUEST' as const }),
  successAC: () => ({ type: 'UPDATE_OWN_PROFILE_SUCCESS' as const }),
  failAC: (errMessage: string) => ({ type: 'UPDATE_OWN_PROFILE_FAIL' as const, payload: errMessage }),
}

export function updateOwnProfileTC(updateProfilePayload: UpdateProfilePayloadType): ThunkType {
  return async function (dispatch) {
    try {
      dispatch(actions.requestAC())
      const { data } = await API.user.updateOwnProfile(updateProfilePayload)
      localStorage.setItem('token', JSON.stringify(data.accessToken))
      userInfoThunk()
      dispatch(actions.successAC())
    } catch (err: any) {
      const { errors, fail }: { errors: RequestBodyValidationErrorsType[], fail: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map(e => e.msg)
        dispatch(actions.failAC(errMsg[0]))
        return
      }
      dispatch(actions.failAC(fail))
    }
  }
}
