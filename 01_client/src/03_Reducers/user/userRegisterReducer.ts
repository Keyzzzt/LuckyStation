import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  id: null as string | null,
  email: null as string | null,
  logo: null as string | null,
  isActivated: false,
  isAdmin: false,
  isAuth: false,
  isSubscribed: false,
  favorite: [] as string[],
  loading: false,
  error: null as string | null, // TODO: Сделать массивом строк?
}

// TODO: Разделить на редюсеры
export const userRegisterReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'REGISTER_REQUEST':
      return { ...state, loading: true, error: null }
    case 'REGISTER_SUCCESS':
      return { ...state, loading: false, error: null }
    case 'REGISTER_FAIL':
      return { ...initialState, loading: false, error: action.payload }
    default:
      return state
  }
}

export const actions = {
  registerRequestAC: () => ({ type: 'REGISTER_REQUEST' as const }),
  registerSuccessAC: () => ({ type: 'REGISTER_SUCCESS' as const }),
  registerFailAC: (errMessage: string) => ({ type: 'REGISTER_FAIL' as const, payload: errMessage }),
}

export function registerThunk(email: string, password: string, confirmPassword: string): ThunkType {
  return async function (dispatch) {
    try {
      dispatch(actions.registerRequestAC())
      await API.auth.registration(email, password)
      dispatch(actions.registerSuccessAC())
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data

      if (errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ') //FIXME: WTF
        dispatch(actions.registerFailAC(errMsg))
        return
      }
      dispatch(actions.registerFailAC(error))
    }
  }
}
