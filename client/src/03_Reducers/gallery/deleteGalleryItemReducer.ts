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
      return { ...state, loading: true, success: false }
    case 'DELETE_SUCCESS':
      return { ...state, loading: false, success: true }
    case 'DELETE_FAIL':
      return { ...state, loading: false, fail: action.payload }
    default:
      return state
  }
}

export const actions = {
  deleteRequestAC: () => ({ type: 'DELETE_REQUEST' as const }),
  deleteSuccessAC: () => ({type: 'DELETE_SUCCESS' as const,}),
  deleteFailAC: (errMessage: string) => ({ type: 'DELETE_FAIL' as const, payload: errMessage }),
}

export function deleteGalleryItemThunk(itemId: string): ThunkType {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(actions.deleteRequestAC())
      await API.admin.deleteGalleryItem(itemId)
      dispatch(actions.deleteSuccessAC())
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.deleteFailAC(errMsg))
        return
      }
      dispatch(actions.deleteFailAC(error))
    }
  }
}