import { BaseThunkType, InferActionTypes } from '../05_Types/01_Base'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  mode: 'light',
}

export const colorThemeReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'TOGGLE_COLOR_THEME':
      const theme = state.mode === 'light' ? 'dark' : 'light'
      return { ...state, mode: theme }
    default:
      return state
  }
}

export const actions = {
  toggleColorTheme: () => ({ type: 'TOGGLE_COLOR_THEME' as const }),
}

export const configThunk = {
  toggleColorTheme: (): ThunkType => async (dispatch, getState) => {
    localStorage.setItem('colorTheme', getState().colorTheme.mode)
    dispatch(actions.toggleColorTheme())
  },
}
