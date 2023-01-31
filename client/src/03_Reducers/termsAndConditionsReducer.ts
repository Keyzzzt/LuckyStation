import { BaseThunkType, InferActionTypes, IValErrMsg } from '../05_Types/01_Base'
import { TermsAndConditionsResponseType } from '../05_Types/ResponseTypes'
import { API } from '../API'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  data: null as null | TermsAndConditionsResponseType,
  fail: '',
}

export const termsAndConditionsReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'LOAD_TERMS_AND_CONDITIONS_SUCCESS':
      return { ...initialState, data: action.payload }
    case 'LOAD_TERMS_AND_CONDITIONS_FAIL':
      return { ...initialState, fail: action.payload }
    default:
      return state
  }
}

export const actions = {
  success: (data: TermsAndConditionsResponseType) => ({ type: 'LOAD_TERMS_AND_CONDITIONS_SUCCESS' as const, payload: data }),
  fail: (errMessage: string) => ({ type: 'LOAD_TERMS_AND_CONDITIONS_FAIL' as const, payload: errMessage }),
}

export function termsAndConditionsThunk(lang: string): ThunkType {
  return async function (dispatch) {
    try {
      // todo Нет такого ендпоинта - сделать на сервере модель и тд и тп
      const { data } = await API.user.getTermsAndConditions(lang)
      dispatch(actions.success(data))
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors.length > 0) {
        const errMsg = errors.map(e => e.msg).join('; ')
        dispatch(actions.fail(errMsg))
        return
      }
      dispatch(actions.fail(error))
    }
  }
}
