import { API } from '../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../05_Types/01_Base'
import { ConfigResponseType } from '../05_Types/ResponseTypes'
import { Dispatch } from 'redux'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  config: {
    companyName: '',
    adminColorTheme: 'light',
    customersColorTheme: 'light',
    darkThemeColors: [],
    lightThemeColors: [],
    defaultLanguage: 'en',
    minPriceForFreeShipping: 1000,
    defaultShippingPriceToNonEUCountries: 100,
    freeShippingMessage: 'You are eligible for free shipping in EU',
    taxRate: 0.2,
    aboutSectionParagraphs: ['']
  },
  fail: '',
}

export const appConfigReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'CONFIG_SUCCESS':
      return { ...initialState, config: action.payload }
    case 'CONFIG_FAIL':
      return { ...initialState, fail: action.payload }

    default:
      return state
  }
}

export const actions = {
  success: (config: ConfigResponseType) => ({ type: 'CONFIG_SUCCESS' as const, payload: config }),
  fail: (errMessage: string) => ({ type: 'CONFIG_FAIL' as const, payload: errMessage }),
}

export function configThunk(): ThunkType {
  return async function (dispatch: Dispatch) {
    try {
      const { data } = await API.config.getConfig()

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
