import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  favoriteLoading: false,
  favoriteSuccess: false,
  favoriteFail: '',
}

export const favoriteReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'FAVORITE_REQUEST':
      return { ...initialState, favoriteLoading: true }
    case 'FAVORITE_SUCCESS':
      return { ...initialState, favoriteSuccess: true }

    case 'FAVORITE_FAIL':
      return { ...initialState, favoriteFail: action.payload }
    case 'FAVORITE_RESET':
      return { ...initialState }

    default:
      return state
  }
}

export const actions = {
  favoriteRequestAC: () => ({ type: 'FAVORITE_REQUEST' as const }),
  favoriteSuccessAC: () => ({ type: 'FAVORITE_SUCCESS' as const }),
  favoriteFailAC: (errMessage: string) => ({ type: 'FAVORITE_FAIL' as const, payload: errMessage }),
  favoriteResetAC: () => ({ type: 'FAVORITE_RESET' as const }),
}

export function toggleFavoriteThunk(productId: string, flag: string): ThunkType {
  return async (dispatch) => {
    try {
      dispatch(actions.favoriteRequestAC())
      await API.product.toggleFavorite(productId, flag)
      dispatch(actions.favoriteSuccessAC())
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.favoriteFailAC(errMsg))
        return
      }
      dispatch(actions.favoriteFailAC(error))
    }
  }
}
