import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  success: false,
  loading: false,
  error: '',
}

export const updateProfileByAdminReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'UPDATE_PROFILE_BY_ADMIN_REQUEST':
      return { ...initialState, loading: true }
    case 'UPDATE_PROFILE_BY_ADMIN_SUCCESS':
      return { ...initialState, success: true }
    case 'UPDATE_PROFILE_BY_ADMIN_FAIL':
      return { ...initialState, error: action.payload }
    case 'UPDATE_PROFILE_BY_ADMIN_RESET':
      return { ...initialState }
    default:
      return state
  }
}

export const actions = {
  updateProfileByAdminRequestAC: () => ({ type: 'UPDATE_PROFILE_BY_ADMIN_REQUEST' as const }),
  updateProfileByAdminSuccessAC: () => ({ type: 'UPDATE_PROFILE_BY_ADMIN_SUCCESS' as const }),
  updateProfileByAdminFailAC: (errMessage: string) => ({ type: 'UPDATE_PROFILE_BY_ADMIN_FAIL' as const, payload: errMessage }),
  updateProfileByAdminResetAC: () => ({ type: 'UPDATE_PROFILE_BY_ADMIN_RESET' as const }),
}

export function updateProfileByAdminThunk(userId: string, formData: any): ThunkType {
  return async function (dispatch) {
    try {
      dispatch(actions.updateProfileByAdminRequestAC())
      await API.admin.updateProfileByAdmin(userId, formData)
      dispatch(actions.updateProfileByAdminSuccessAC())
      dispatch(actions.updateProfileByAdminResetAC())
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.updateProfileByAdminFailAC(errMsg))
        return
      }
      dispatch(actions.updateProfileByAdminFailAC(error))
    }
  }
}
