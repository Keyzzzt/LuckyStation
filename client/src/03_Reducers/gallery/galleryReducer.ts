import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'

type ThunkType = BaseThunkType<ActionType>
type ActionType = InferActionTypes<typeof actions>


export type GalleryListItemType = {
  _id: string
  user: string
  title: string
  src: {
    small: string
    large: string
  }
  className: 'h_stretch' | 'v_stretch' | 'big' | 'small'
  description: string
  createdAt: string
  updatedAt: string
}
export type GalleryPageType = typeof initialState

const initialState = {
  galleryListItems: null as null | GalleryListItemType[],
  loading: false,
  fail: '',
}

export const galleryReducer = (state = initialState, action: ActionType): GalleryPageType => {
  switch (action.type) {
    case 'GALLERY_LIST_REQUEST':
      return { ...state, galleryListItems: null, loading: false }
    case 'GALLERY_LIST_SUCCESS':
      return { ...state, galleryListItems: action.payload, loading: false }
    case 'GALLERY_LIST_FAIL':
      return { ...state, fail: action.payload, loading: false }
    default:
      return state
  }
}

export const actions = {
  requestAC: () => ({ type: 'GALLERY_LIST_REQUEST' as const }),
  successAC: (data: GalleryListItemType[]) => ({ type: 'GALLERY_LIST_SUCCESS' as const, payload: data }),
  failAC: (errMessage: string) => ({ type: 'GALLERY_LIST_FAIL' as const, payload: errMessage }),
}

export function galleryListTC(): ThunkType {
  return async (dispatch) => {
    try {
      dispatch(actions.requestAC())
      const { data } = await API.admin.getGalleryList()
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