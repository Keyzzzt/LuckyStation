import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { Dispatch } from 'redux'
import { GalleryListItemType } from './galleryReducer'

type ThunkType = BaseThunkType<ActionType>
type ActionType = InferActionTypes<typeof actions>
export type InitialState = typeof initialState

const initialState = {
  success: false,
  loading: false,
  fail: '',
}

export const deleteGalleryItemReducer = (state = initialState, action: ActionType): InitialState => {
  switch (action.type) {
    case 'DELETE_REQUEST':
      return { ...state, success: false, fail: '', loading: true }
    case 'DELETE_SUCCESS':
      return { ...state, success: true, loading: false }
    case 'DELETE_FAIL':
      return { ...state, fail: action.payload, loading: false }
    default:
      return state
  }
}

export const actions = {
  requestAC: () => ({ type: 'DELETE_REQUEST' as const }),
  successAC: () => ({ type: 'DELETE_SUCCESS' as const }),
  failAC: (errMessage: string) => ({ type: 'DELETE_FAIL' as const, payload: errMessage }),
}

export function deleteGalleryItemThunk(itemId: string): ThunkType {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(actions.requestAC())
      await API.admin.deleteGalleryItem(itemId)
      dispatch(actions.successAC())
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.failAC(errMsg))
        return
      }
      dispatch(actions.failAC(error))
    }
  }
}