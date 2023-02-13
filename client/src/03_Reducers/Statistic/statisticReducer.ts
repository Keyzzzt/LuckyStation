import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { Dispatch } from 'redux'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

// TODO TYPE
const initialState = {
  statistic: null as null | any,
  loading: false,
  fail: '',
}

// todo разделить редюсеры

export const statisticReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'STATISTIC_REQUEST':
      return { ...state, statistic: null, fail: '', loading: true }
    case 'STATISTIC_SUCCESS':
      return { ...state, statistic: action.payload, loading: false }
    case 'STATISTIC_FAIL':
      return { ...state, fail: action.payload, loading: false }
    default:
      return state
  }
}

export const actions = {
  requestAC: () => ({ type: 'STATISTIC_REQUEST' as const }),
  successAC: (statistic: any) => ({ type: 'STATISTIC_SUCCESS' as const, payload: statistic }),
  failAC: (errMessage: string) => ({ type: 'STATISTIC_FAIL' as const, payload: errMessage }),
}

export function statisticThunk(): ThunkType {
  return async function(dispatch: Dispatch) {
    try {
      dispatch(actions.requestAC())
      const { data } = await API.admin.getStatistic()
      dispatch(actions.successAC(data))
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.failAC(errMsg))
        return
      }
      dispatch(actions.failAC(error))
    }
  }
}
