import { API } from '../../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg, Survey } from '../../../05_Types/01_Base'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  loading: false,
  success: false,
  fail: '',
}

export const createSurveyReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'CREATE_SURVEY_REQUEST':
      return { ...initialState, loading: true }
    case 'CREATE_SURVEY_SUCCESS':
      return { ...initialState, success: true }
    case 'CREATE_SURVEY_FAIL':
      return { ...initialState, fail: action.payload }
    case 'CREATE_SURVEY_RESET':
      return { ...initialState }
    default:
      return state
  }
}

export const actions = {
  createSurveyRequestAC: () => ({ type: 'CREATE_SURVEY_REQUEST' as const }),
  createSurveySuccessAC: () => ({ type: 'CREATE_SURVEY_SUCCESS' as const }),
  createSurveyFailAC: (errMessage: string) => ({ type: 'CREATE_SURVEY_FAIL' as const, payload: errMessage }),
  createSurveyResetAC: () => ({ type: 'CREATE_SURVEY_RESET' as const }),
}

export function createSurveyThunk(survey: Survey): ThunkType {
  return async (dispatch) => {
    try {
      dispatch(actions.createSurveyRequestAC())
      await API.admin.createSurvey(survey)
      dispatch(actions.createSurveySuccessAC())
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.createSurveyFailAC(errMsg))
        return
      }
      dispatch(actions.createSurveyFailAC(error))
    }
  }
}
