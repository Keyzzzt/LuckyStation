import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { GalleryListItemType } from './galleryReducer'

type ThunkType = BaseThunkType<ActionType>
type ActionType = InferActionTypes<typeof actions>
export type InitialState = typeof initialState

const initialState = {
  itemInfo: null as null | GalleryListItemType,
  loading: false,
  fail: '',
}

export const galleryItemInfoReducer = (state = initialState, action: ActionType): InitialState => {
  switch (action.type) {
    case 'GALLERY_ITEM_INFO_REQUEST':
      return { ...state, itemInfo: null, fail: '', loading: true }
    case 'GALLERY_ITEM_INFO_SUCCESS':
      return { ...state, itemInfo: action.payload, loading: false }
    case 'GALLERY_ITEM_INFO_FAIL':
      return { ...state, fail: action.payload, loading: false }
    default:
      return state
  }
}

export const actions = {
  requestAC: () => ({ type: 'GALLERY_ITEM_INFO_REQUEST' as const }),
  successAC: (data: GalleryListItemType) => ({
    type: 'GALLERY_ITEM_INFO_SUCCESS' as const,
    payload: data,
  }),
  failAC: (errMessage: string) => ({ type: 'GALLERY_ITEM_INFO_FAIL' as const, payload: errMessage }),
}

export function galleryItemInfoTC(itemId: string): ThunkType {
  return async (dispatch) => {
    try {
      dispatch(actions.requestAC())
      const { data } = await API.admin.getGalleryItem(itemId)
      dispatch(actions.successAC(data))
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