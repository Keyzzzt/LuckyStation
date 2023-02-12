import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { Dispatch } from 'redux'
import { GalleryListItemType } from './galleryReducer'

type ThunkType = BaseThunkType<ActionType>
type ActionType = InferActionTypes<typeof actions>
export type InitialState = typeof initialState
export type AddGalleryItemType = {
  title: string
  description: string
  className: 'h_stretch' | 'v_stretch' | 'big' | 'small'
  src: {
    small: string
    large: string
  }
}

const initialState = {
  success: false,
  loading: false,
  fail: '',
}

export const addGalleryItemReducer = (state = initialState, action: ActionType): InitialState => {
  switch (action.type) {
    case 'ADD_GALLERY_ITEM_REQUEST':
      return { ...state, loading: true, success: false }
    case 'ADD_GALLERY_ITEM_SUCCESS':
      console.log(action)
      return { ...state, loading: false, success: true }
    case 'ADD_GALLERY_ITEM_FAIL':
      return { ...state, loading: false, fail: action.payload }
    default:
      return state
  }
}

export const actions = {
  RequestAC: () => ({ type: 'ADD_GALLERY_ITEM_REQUEST' as const }),
  SuccessAC: () => ({type: 'ADD_GALLERY_ITEM_SUCCESS' as const,}),
  FailAC: (errMessage: string) => ({ type: 'ADD_GALLERY_ITEM_FAIL' as const, payload: errMessage }),
}

export function addGalleryItemThunk(data: AddGalleryItemType): ThunkType {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(actions.RequestAC())
      await API.admin.addGalleryItem(data)
      dispatch(actions.SuccessAC())
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.FailAC(errMsg))
        return
      }
      dispatch(actions.FailAC(error))
    }
  }
}