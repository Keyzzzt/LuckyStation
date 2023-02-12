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

export type UpdateData = {
  title: string
  description: string
  src: {
    small: string
    large: string
  }
  className: 'h_stretch' | 'v_stretch' | 'big' | 'small'
}

export const editGalleryItemReducer = (state = initialState, action: ActionType): InitialState => {
  switch (action.type) {
    case 'GALLERY_ITEM_EDIT_REQUEST':
      return { ...state, loading: true, success: false }
    case 'GALLERY_ITEM_EDIT_SUCCESS':
      console.log(action)
      return { ...state, loading: false, success: true }
    case 'GALLERY_ITEM_EDIT_FAIL':
      return { ...state, loading: false, fail: action.payload }
    default:
      return state
  }
}

export const actions = {
  galleryItemEditRequestAC: () => ({ type: 'GALLERY_ITEM_EDIT_REQUEST' as const }),
  galleryItemEditSuccessAC: () => ({type: 'GALLERY_ITEM_EDIT_SUCCESS' as const,}),
  galleryItemEditFailAC: (errMessage: string) => ({ type: 'GALLERY_ITEM_EDIT_FAIL' as const, payload: errMessage }),
}

export function editGalleryItemThunk(updateData: UpdateData, itemId: string): ThunkType {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(actions.galleryItemEditRequestAC())
      await API.admin.editGalleryItem(updateData, itemId)
      dispatch(actions.galleryItemEditSuccessAC())
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.galleryItemEditFailAC(errMsg))
        return
      }
      dispatch(actions.galleryItemEditFailAC(error))
    }
  }
}