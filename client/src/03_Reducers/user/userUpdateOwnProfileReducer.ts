import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { userInfoThunk } from './userInfoReducer'

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
      return { ...initialState, loading: true }
    case 'UPDATE_OWN_PROFILE_SUCCESS':
      return { ...initialState, success: true }
    case 'UPDATE_OWN_PROFILE_FAIL':
      return { ...initialState, fail: action.payload }
    case 'UPDATE_OWN_PROFILE_RESET':
      return { ...initialState }
    default:
      return state
  }
}

export const actions = {
  updateOwnProfileRequestAC: () => ({ type: 'UPDATE_OWN_PROFILE_REQUEST' as const }),
  updateOwnProfileSuccessAC: () => ({ type: 'UPDATE_OWN_PROFILE_SUCCESS' as const }),
  updateOwnProfileFailAC: (errMessage: string) => ({ type: 'UPDATE_OWN_PROFILE_FAIL' as const, payload: errMessage }),
  updateOwnProfileResetAC: () => ({ type: 'UPDATE_OWN_PROFILE_RESET' as const }),
}

export function updateOwnProfileThunk(formData: any): ThunkType {
  return async function (dispatch, getState) {
    try {
      dispatch(actions.updateOwnProfileRequestAC())
      const { data } = await API.user.updateOwnProfile(formData)
      localStorage.setItem('token', data.accessToken)
      userInfoThunk()
      dispatch(actions.updateOwnProfileSuccessAC())
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg)
        dispatch(actions.updateOwnProfileFailAC(errMsg[0]))
        console.log(errMsg)

        return
      }
      dispatch(actions.updateOwnProfileFailAC(error))
    }
  }
}
