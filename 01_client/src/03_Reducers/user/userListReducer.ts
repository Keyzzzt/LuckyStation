import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { UserTypeForList } from '../../05_Types/APIResponse'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  users: null as null | UserTypeForList[],
  loading: false,
  error: null as string | null,
}

export const userListReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'USER_LIST_REQUEST':
      return { ...state, loading: true, error: null }
    case 'USER_LIST_SUCCESS':
      return { ...state, loading: false, error: null, users: action.payload }
    case 'USER_LIST_FAIL':
      return { ...initialState, loading: false, error: action.payload, users: null }
    default:
      return state
  }
}

export const actions = {
  getUsersRequestAC: () => ({ type: 'USER_LIST_REQUEST' as const }),
  getUsersSuccessAC: (data: UserTypeForList[]) => ({ type: 'USER_LIST_SUCCESS' as const, payload: data }),
  getUsersFailAC: (errMessage: string) => ({ type: 'USER_LIST_FAIL' as const, payload: errMessage }),
}

export function usersListThunk(page: number, limit: number): ThunkType {
  return async function (dispatch, getState) {
    try {
      dispatch(actions.getUsersRequestAC())
      const { data } = await API.admin.getUsers(page, limit)
      dispatch(actions.getUsersSuccessAC(data.items))
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.getUsersFailAC(errMsg))
        return
      }
      dispatch(actions.getUsersFailAC(error))
    }
  }
}
