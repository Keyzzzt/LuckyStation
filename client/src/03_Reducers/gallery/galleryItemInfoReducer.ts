import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { Dispatch } from 'redux'
import { GalleryListItemType } from './galleryReducer'

type ThunkType = BaseThunkType<ActionType>
type ActionType = InferActionTypes<typeof actions>
export type InitialState = typeof initialState

const initialState = {
  itemInfo: null as null | GalleryListItemType,
  success: false,
  loading: false,
  fail: '',
}

export const galleryItemInfoReducer = (state = initialState, action: ActionType): InitialState => {
  switch (action.type) {
    case 'GALLERY_ITEM_INFO_REQUEST':
      return { ...state, loading: true }
    case 'GALLERY_ITEM_INFO_SUCCESS':
      console.log(action)
      return { ...state, itemInfo: action.payload, loading: false, success: true }
    case 'GALLERY_ITEM_INFO_FAIL':
      return { ...state, loading: false, fail: action.payload }
    default:
      return state
  }
}

export const actions = {
  galleryItemInfoRequestAC: () => ({ type: 'GALLERY_ITEM_INFO_REQUEST' as const }),
  galleryItemInfoSuccessAC: (data: GalleryListItemType) => ({
    type: 'GALLERY_ITEM_INFO_SUCCESS' as const,
    payload: data,
  }),
  galleryItemInfoFailAC: (errMessage: string) => ({ type: 'GALLERY_ITEM_INFO_FAIL' as const, payload: errMessage }),
}

export function galleryItemInfoThunk(itemId: string): ThunkType {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(actions.galleryItemInfoRequestAC())
      const { data } = await API.admin.getGalleryItem(itemId)
      console.log(data)
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