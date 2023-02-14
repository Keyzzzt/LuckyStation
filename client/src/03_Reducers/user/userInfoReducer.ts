import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { UserResponseType } from '../../05_Types/ResponseTypes'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  userInfo: null as null | UserResponseType,
  fail: '',
}

export const userInfoReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'USER_INFO_SUCCESS':
      return { ...initialState, userInfo: action.payload }
    case 'USER_INFO_FAIL':
      return { ...initialState, fail: action.payload }
    case 'USER_INFO_RESET':
      return { ...initialState }
    case 'ADD_TO_FAVORITE':
      const isFavorite = state.userInfo?.favorite?.find(n => n === action.payload)
      if (isFavorite) {
        return { ...state }
      } else {
        //@ts-ignore
        return { ...state, userInfo: { ...state.userInfo, favorite: [...state.userInfo?.favorite, action.payload] } }
      }
    case 'REMOVE_FROM_FAVORITE':
      return {
        ...state,
        //@ts-ignore
        userInfo: { ...state.userInfo, favorite: [...state.userInfo?.favorite.filter(x => x !== action.payload)] },
      }
    case 'SUBSCRIBE':
      if (action.payload === state.userInfo?.email) {
        return { ...state, userInfo: { ...state.userInfo, isSubscribed: true } }
      } else {
        return { ...state }
      }
    default:
      return state
  }
}

export const actions = {
  userInfoSuccessAC: (data: UserResponseType) => ({ type: 'USER_INFO_SUCCESS' as const, payload: data }),
  userInfoFailAC: (errMessage: string) => ({ type: 'USER_INFO_FAIL' as const, payload: errMessage }),
  userInfoResetAC: () => ({ type: 'USER_INFO_RESET' as const }),

  logoutSuccessAC: () => ({ type: 'LOGOUT_SUCCESS' as const }),
  logoutFailAC: (errMessage: string) => ({ type: 'LOGOUT_FAIL' as const, payload: errMessage }),

  favoriteFailAC: (errMessage: string) => ({ type: 'FAVORITE_FAIL' as const, payload: errMessage }),
  addToFavoriteAC: (productId: string) => ({ type: 'ADD_TO_FAVORITE' as const, payload: productId }),
  removeFromFavoriteAC: (productId: string) => ({ type: 'REMOVE_FROM_FAVORITE' as const, payload: productId }),

  subscribeFailAC: (errMessage: string) => ({ type: 'SUBSCRIBE_FAIL' as const, payload: errMessage }),
  subscribeAC: (email: string) => ({ type: 'SUBSCRIBE' as const, payload: email }),
  unSubscribeAC: (email: string) => ({ type: 'UNSUBSCRIBE' as const, payload: email }),
}

// Мы не запрашиваем пользователя занового после того как добавили в избранное (То же самое и с подпиской)
// Мы отправляем запрос на базу и меняем стейт
// Таким образом данные в базе и на фронте сопадают без запроса пользователя с новыми даннми
export function toggleFavoriteThunk(productId: string, isFavorite: boolean): ThunkType {
  return async (dispatch) => {
    try {
      await API.product.toggleFavorite(productId, isFavorite)
      if (isFavorite) {
        dispatch(actions.removeFromFavoriteAC(productId))
      } else {
        dispatch(actions.addToFavoriteAC(productId))
      }
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map(e => e.msg).join('; ')
        dispatch(actions.favoriteFailAC(errMsg))
        return
      }
      dispatch(actions.favoriteFailAC(error))
    }
  }
}
export function subscribeThunk(email: string): ThunkType {
  return async (dispatch) => {
    try {
      await API.user.subscribe(email)
      dispatch(actions.subscribeAC(email))
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map(e => e.msg).join('; ')
        dispatch(actions.subscribeFailAC(errMsg))
        return
      }
      dispatch(actions.subscribeFailAC(error))
    }
  }
}

export function userInfoThunk(): ThunkType {
  return async function (dispatch) {
    try {
      const { data } = await API.user.getProfile()
      dispatch(actions.userInfoSuccessAC(data))
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map(e => e.msg).join('; ')
        dispatch(actions.userInfoFailAC(errMsg))
        return
      }
      dispatch(actions.userInfoFailAC(error))
    }
  }
}

export function logoutThunk(): ThunkType {
  return async function (dispatch) {
    try {
      await API.auth.logout()
      dispatch(actions.userInfoResetAC())
      dispatch(actions.logoutSuccessAC())
      localStorage.removeItem('token')
    } catch (err: any) {
      // FIXME
      alert('Logout Fail')
    }
  }
}

export function authenticateThunk(): ThunkType {
  return async function (dispatch) {
    try {
      const { data } = await API.auth.authenticate()
      dispatch(userInfoThunk())
      localStorage.setItem('token', data.accessToken)
    } catch (err: any) {
      console.log('Authentication failed, please log in.')
    }
  }
}
