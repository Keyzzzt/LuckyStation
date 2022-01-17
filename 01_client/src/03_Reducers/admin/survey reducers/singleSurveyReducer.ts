import { API } from '../../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../../05_Types/01_Base'
import { SurveyFromDB } from '../../../05_Types/APIResponse'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  survey: null as null | SurveyFromDB,
  loading: false,
  fail: '',
}

export const singleSurveyReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'SINGLE_SURVEY_REQUEST':
      return { ...initialState, loading: true }
    case 'SINGLE_SURVEY_SUCCESS':
      return { ...initialState, survey: action.payload }
    case 'SINGLE_SURVEY_FAIL':
      return { ...initialState, fail: action.payload }
    case 'SINGLE_SURVEY_RESET':
      return { ...initialState }
    default:
      return state
  }
}

export const actions = {
  request: () => ({ type: 'SINGLE_SURVEY_REQUEST' as const }),
  success: (survey: SurveyFromDB) => ({ type: 'SINGLE_SURVEY_SUCCESS' as const, payload: survey }),
  fail: (errMessage: string) => ({ type: 'SINGLE_SURVEY_FAIL' as const, payload: errMessage }),
  reset: () => ({ type: 'SINGLE_SURVEY_RESET' as const }),
}

export function singleSurveyThunk(surveyId: string): ThunkType {
  return async (dispatch) => {
    try {
      dispatch(actions.request())
      const { data } = await API.admin.getSingleSurvey(surveyId)
      dispatch(actions.success(data))
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
