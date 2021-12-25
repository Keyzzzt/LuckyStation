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
      return { ...state, loading: true, error: null }
    case 'USER_INFO_SUCCESS':
      return { loading: false, error: null, userInfo: action.payload }
    case 'USER_INFO_FAIL':
      return { userInfo: null, loading: false, error: action.payload }

    default:
      return state
  }
}

export const actions = {
  getSingleUserRequestAC: () => ({ type: 'USER_INFO_REQUEST' as const }),
  getSingleUserSuccessAC: (data: User) => ({ type: 'USER_INFO_SUCCESS' as const, payload: data }),
  getSingleUserFailAC: (errMessage: string) => ({ type: 'USER_INFO_FAIL' as const, payload: errMessage }),
}

export function userInfoThunk(userId: string): ThunkType {
  return async function (dispatch) {
    try {
      dispatch(actions.getSingleUserRequestAC())
      const { data } = await API.admin.getSingleUser(userId)
      dispatch(actions.getSingleUserSuccessAC(data))
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.getSingleUserFailAC(errMsg))
        return
      }
      dispatch(actions.getSingleUserFailAC(error))
    }
  }
}
