import { API } from '../../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../../05_Types/01_Base'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  loading: false,
  success: false,
  fail: '',
}

export const deleteSurveyReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'DELETE_SURVEY_REQUEST':
      return { ...initialState, loading: true }
    case 'DELETE_SURVEY_SUCCESS':
      return { ...initialState, success: true }
    case 'DELETE_SURVEY_FAIL':
      return { ...initialState, fail: action.payload }
    case 'DELETE_SURVEY_RESET':
      return { ...initialState }
    default:
      return state
  }
}

export const actions = {
  deleteSurveyRequest: () => ({ type: 'DELETE_SURVEY_REQUEST' as const }),
  deleteSurveySuccessAC: () => ({ type: 'DELETE_SURVEY_SUCCESS' as const }),
  deleteSurveyFailAC: (errMessage: string) => ({ type: 'DELETE_SURVEY_FAIL' as const, payload: errMessage }),
  deleteSurveyResetAC: () => ({ type: 'DELETE_SURVEY_RESET' as const }),
}

export function deleteSurveyThunk(surveyId: string): ThunkType {
  return async (dispatch) => {
    try {
      dispatch(actions.deleteSurveyRequest())
      await API.admin.deleteSurvey(surveyId)
      dispatch(actions.deleteSurveySuccessAC())
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.deleteSurveyFailAC(errMsg))
        return
      }
      dispatch(actions.deleteSurveyFailAC(error))
    }
  }
}
