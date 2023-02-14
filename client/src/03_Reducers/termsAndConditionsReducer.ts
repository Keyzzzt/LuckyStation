import { BaseThunkType, InferActionTypes, IValErrMsg } from '../05_Types/01_Base'
import { TermsAndConditionsResponseType } from '../05_Types/ResponseTypes'
import { API } from '../API'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  data: null as null | TermsAndConditionsResponseType,
  loading: false,
  fail: '',
}

export const termsAndConditionsReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'LOAD_TERMS_AND_CONDITIONS_REQUEST':
      return { ...state, data: null, fail: '', loading: true }
    case 'LOAD_TERMS_AND_CONDITIONS_SUCCESS':
      return { ...state, data: action.payload, loading: false }
    case 'LOAD_TERMS_AND_CONDITIONS_FAIL':
      return { ...state, fail: action.payload, loading: false }
    default:
      return state
  }
}

export const actions = {
  requestAC: () => ({ type: 'LOAD_TERMS_AND_CONDITIONS_REQUEST' as const }),
  successAC: (data: TermsAndConditionsResponseType) => ({ type: 'LOAD_TERMS_AND_CONDITIONS_SUCCESS' as const, payload: data }),
  failAC: (errMessage: string) => ({ type: 'LOAD_TERMS_AND_CONDITIONS_FAIL' as const, payload: errMessage }),
}

export function termsAndConditionsTC(lang: string): ThunkType {
  return async function (dispatch) {
    try {
      dispatch(actions.requestAC())
      const { data } = await API.user.getTermsAndConditions(lang)
      dispatch(actions.successAC(data))
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors.length > 0) {
        const errMsg = errors.map(e => e.msg).join('; ')
        dispatch(actions.failAC(errMsg))
        return
      }
      dispatch(actions.failAC(error))
    }
  }
}
