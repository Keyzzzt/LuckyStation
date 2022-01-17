// import { API } from '../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../05_Types/01_Base'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  colorTheme: 'light',
  loading: false,
  fail: '',
}

export const configReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'TOGGLE_COLOR_THEME_REQUEST':
      return { ...initialState, loading: true }
    case 'TOGGLE_COLOR_THEME_SUCCESS':
      const newColorTheme = state.colorTheme === 'light' ? 'dark' : 'light'
      return { ...initialState, colorTheme: newColorTheme }
    case 'TOGGLE_COLOR_THEME_FAIL':
      return { ...initialState, fail: action.payload }
    default:
      return state
  }
}

export const actions = {
  request: () => ({ type: 'TOGGLE_COLOR_THEME_REQUEST' as const }),
  success: () => ({ type: 'TOGGLE_COLOR_THEME_SUCCESS' as const }),
  fail: (errMessage: string) => ({ type: 'TOGGLE_COLOR_THEME_FAIL' as const, payload: errMessage }),
}

export const configThunk = {
  toggleColorTheme: (): ThunkType => async (dispatch) => {
    try {
      console.log('Config Reducer')

      dispatch(actions.request())
      // await API.config.setColorTheme() // TODO:
      dispatch(actions.success())
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.fail(errMsg))
        return
      }
      dispatch(actions.fail(error))
    }
  },
}
