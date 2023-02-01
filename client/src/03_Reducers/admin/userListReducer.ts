import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { UserDataForListType } from '../../05_Types/ResponseTypes'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  users: null as null | UserDataForListType[],
  fail: '',
}

export const userListReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'USER_LIST_SUCCESS':
      return { ...initialState, users: action.payload }
    case 'USER_LIST_FAIL':
      return { ...initialState, fail: action.payload }
    default:
      return state
  }
}

export const actions = {
  getUsersSuccessAC: (data: UserDataForListType[]) => ({ type: 'USER_LIST_SUCCESS' as const, payload: data }),
  getUsersFailAC: (errMessage: string) => ({ type: 'USER_LIST_FAIL' as const, payload: errMessage }),
}

export function usersListThunk(page: number, limit: number): ThunkType {
  return async function (dispatch) {
    try {
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