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

export const updateProfileByAdminReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'UPDATE_PROFILE_BY_ADMIN_REQUEST':
      return { ...initialState, loading: true }
    case 'UPDATE_PROFILE_BY_ADMIN_SUCCESS':
      return { ...initialState, success: true }
    case 'UPDATE_PROFILE_BY_ADMIN_FAIL':
      return { ...initialState, fail: action.payload }
    case 'UPDATE_PROFILE_BY_ADMIN_RESET':
      return { ...initialState }
    default:
      return state
  }
}

export const actions = {
  request: () => ({ type: 'UPDATE_PROFILE_BY_ADMIN_REQUEST' as const }),
  success: () => ({ type: 'UPDATE_PROFILE_BY_ADMIN_SUCCESS' as const }),
  fail: (errMessage: string) => ({ type: 'UPDATE_PROFILE_BY_ADMIN_FAIL' as const, payload: errMessage }),
  reset: () => ({ type: 'UPDATE_PROFILE_BY_ADMIN_RESET' as const }),
}

export function updateProfileByAdminThunk(userId: string, formData: any): ThunkType {
  return async function (dispatch) {
    try {
      dispatch(actions.request())
      await API.admin.updateProfileByAdmin(userId, formData)
      dispatch(actions.success())
      // dispatch(actions.reset()) // todo хз зачем это тут было
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
