import { API } from '../../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../../05_Types/01_Base'
import { SurveyFromDB } from '../../../05_Types/APIResponse'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  surveys: null as null | SurveyFromDB[],
  loading: false,
  fail: '',
}

export const surveyListReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'SURVEY_LIST_REQUEST':
      return { ...initialState, loading: true }
    case 'SURVEY_LIST_SUCCESS':
      return { ...initialState, surveys: action.payload }
    case 'SURVEY_LIST_FAIL':
      return { ...initialState, fail: action.payload }
    case 'SURVEY_LIST_RESET':
      return { ...initialState }
    default:
      return state
  }
}

export const actions = {
  surveyListRequestAC: () => ({ type: 'SURVEY_LIST_REQUEST' as const }),
  surveyListSuccessAC: (data: SurveyFromDB[]) => ({ type: 'SURVEY_LIST_SUCCESS' as const, payload: data }),
  surveyListFailAC: (errMessage: string) => ({ type: 'SURVEY_LIST_FAIL' as const, payload: errMessage }),
  surveyListResetAC: () => ({ type: 'SURVEY_LIST_RESET' as const }),
}

export function surveyListThunk(): ThunkType {
  return async (dispatch) => {
    try {
      dispatch(actions.surveyListRequestAC())
      const { data } = await API.admin.getSurveys()
      dispatch(actions.surveyListSuccessAC(data.items))
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.surveyListFailAC(errMsg))
        return
      }
      dispatch(actions.surveyListFailAC(error))
    }
  }
}
