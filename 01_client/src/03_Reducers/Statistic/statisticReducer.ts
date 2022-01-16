import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { userInfoThunk } from './../user/userInfoReducer'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  statistic: {} as {} | any,
  loading: false,
  fail: '',
}

export const statisticReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'STATISTIC_REQUEST':
      return { ...initialState, loading: true }
    case 'STATISTIC_SUCCESS':
      return { ...initialState, statistic: action.payload }
    case 'STATISTIC_FAIL':
      return { ...initialState, fail: action.payload }
    case 'STATISTIC_RESET':
      return { ...initialState }

    case 'REMOVE_EMAIL_SUCCESS':
      return { ...initialState, statistic: { ...state.statistic } }
    default:
      return state
  }
}

export const actions = {
  statisticRequestAC: () => ({ type: 'STATISTIC_REQUEST' as const }),
  statisticSuccessAC: (statistic: any) => ({ type: 'STATISTIC_SUCCESS' as const, payload: statistic }),
  statisticFailAC: (errMessage: string) => ({ type: 'STATISTIC_FAIL' as const, payload: errMessage }),
  statisticResetAC: () => ({ type: 'STATISTIC_RESET' as const }),

  removeEmailSuccessAC: (email: any) => ({ type: 'REMOVE_EMAIL_SUCCESS' as const, payload: email }),
  removeEmailFailAC: (errMessage: string) => ({ type: 'REMOVE_EMAIL_FAIL' as const, payload: errMessage }),
}

export function statisticThunk(): ThunkType {
  return async function (dispatch) {
    try {
      dispatch(actions.statisticRequestAC())
      const { data } = await API.admin.getStatistic()
      dispatch(actions.statisticSuccessAC(data))
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.statisticFailAC(errMsg))
        return
      }
      dispatch(actions.statisticFailAC(error))
    }
  }
}

export function removeEmailThunk(email: string): ThunkType {
  return async function (dispatch) {
    try {
      dispatch(actions.statisticRequestAC())
      await API.admin.removeEmailFromList(email)
      dispatch(statisticThunk())
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.removeEmailFailAC(errMsg))
        return
      }
      dispatch(actions.removeEmailFailAC(error))
    }
  }
}
