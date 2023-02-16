import { API } from '../../API'
import { BaseThunkType, InferActionTypes, RequestBodyValidationErrorsType } from '../../05_Types/01_Base'
import { UserDataForListType } from '../../05_Types/ResponseTypes'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  users: null as null | UserDataForListType[],
  loading: false,
  fail: '',
}

export const usersListReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'USER_LIST_REQUEST':
      return { ...state, users: null, fail: '', loading: true }
    case 'USER_LIST_SUCCESS':
      return { ...state, users: action.payload, loading: false }
    case 'USER_LIST_FAIL':
      return { ...state, fail: action.payload, loading: false }
    default:
      return state
  }
}

export const actions = {
  requestAC: () => ({ type: 'USER_LIST_REQUEST' as const }),
  successAC: (data: UserDataForListType[]) => ({ type: 'USER_LIST_SUCCESS' as const, payload: data }),
  failAC: (errMessage: string) => ({ type: 'USER_LIST_FAIL' as const, payload: errMessage }),
}

export function usersListTC(page: number, limit: number): ThunkType {
  return async function(dispatch) {
    try {
      dispatch(actions.requestAC())
      const { data } = await API.admin.getUsers(page, limit)
      dispatch(actions.successAC(data.items))
    } catch (err: any) {
      const { errors, fail }: { errors: RequestBodyValidationErrorsType[], fail: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.failAC(errMsg))
        return
      }
      dispatch(actions.failAC(fail))
    }
  }
}
