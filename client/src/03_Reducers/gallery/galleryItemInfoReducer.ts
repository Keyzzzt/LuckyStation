import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { Dispatch } from 'redux'
import { GalleryListItemType } from './galleryReducer'

type ThunkType = BaseThunkType<ActionType>
type ActionType = InferActionTypes<typeof actions>
export type InitialState = typeof initialState

const initialState = {
  itemInfo: null as null | GalleryListItemType,
  fail: '',
}

export const galleryItemInfoReducer = (state = initialState, action: ActionType): InitialState => {
  switch (action.type) {
    case 'GALLERY_ITEM_INFO_SUCCESS':
      return { ...state, itemInfo: action.payload }
    case 'GALLERY_ITEM_INFO_FAIL':
      return { ...state, fail: action.payload }
    default:
      return state
  }
}

export const actions = {
  galleryItemInfoSuccessAC: (data: GalleryListItemType) => ({
    type: 'GALLERY_ITEM_INFO_SUCCESS' as const,
    payload: data,
  }),
  galleryItemInfoFailAC: (errMessage: string) => ({ type: 'GALLERY_ITEM_INFO_FAIL' as const, payload: errMessage }),
}

export function galleryItemInfoThunk(itemId: string): ThunkType {
  return async (dispatch: Dispatch) => {
    try {
      const { data } = await API.admin.getGalleryItem(itemId)
      dispatch(actions.galleryItemInfoSuccessAC(data))
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.galleryItemInfoFailAC(errMsg))
        return
      }
      dispatch(actions.galleryItemInfoFailAC(error))
    }
  }
}