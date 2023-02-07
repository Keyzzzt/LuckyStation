import { API } from '../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../05_Types/01_Base'
import { Dispatch } from 'redux'

type ThunkType = BaseThunkType<ActionType>
type ActionType = InferActionTypes<typeof actions>


export type GalleryListItemType = {
  _id: string
  src: string
  class: 'h_stretch' | 'v_stretch' | 'big'
  title: string
  description: string
  createdAt: string
  updatedAt: string
}
export type GalleryPageType = typeof initialState

const initialState = {
  galleryList: null as null | GalleryListItemType[],
  fail: '',
}

export const galleryListReducer = (state = initialState, action: ActionType): GalleryPageType => {
  switch (action.type) {
    case 'GALLERY_LIST_SUCCESS':
      return {
        ...initialState, galleryList: action.payload.items,
      }
    case 'GALLERY_LIST_FAIL':
      return { ...initialState, fail: action.payload }
    default:
      return state
  }
}

export const actions = {
  success: (data: any) => ({ type: 'GALLERY_LIST_SUCCESS' as const, payload: data }),
  fail: (errMessage: string) => ({ type: 'GALLERY_LIST_FAIL' as const, payload: errMessage }),
}

export function galleryListThunk(): ThunkType {
  return async (dispatch: Dispatch) => {
    try {
      const { data } = await API.admin.getGalleryList()
      dispatch(actions.success(data))
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.fail(errMsg))
        return
      }
      dispatch(actions.fail(error))
    }
  }
}