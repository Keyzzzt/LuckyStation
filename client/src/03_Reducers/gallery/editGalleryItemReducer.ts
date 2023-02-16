import { API } from '../../API'
import { BaseThunkType, InferActionTypes, RequestBodyValidationErrorsType } from '../../05_Types/01_Base'

type ThunkType = BaseThunkType<ActionType>
type ActionType = InferActionTypes<typeof actions>
export type InitialState = typeof initialState

const initialState = {
  success: false,
  loading: false,
  fail: '',
}

export type UpdatePayloadType = {
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
      return { ...state, success: false, fail: '', loading: true }
    case 'GALLERY_ITEM_EDIT_SUCCESS':
      console.log(action)
      return { ...state, success: true, loading: false }
    case 'GALLERY_ITEM_EDIT_FAIL':
      return { ...state, fail: action.payload, loading: false }
    default:
      return state
  }
}

export const actions = {
  requestAC: () => ({ type: 'GALLERY_ITEM_EDIT_REQUEST' as const }),
  successAC: () => ({type: 'GALLERY_ITEM_EDIT_SUCCESS' as const,}),
  failAC: (errMessage: string) => ({ type: 'GALLERY_ITEM_EDIT_FAIL' as const, payload: errMessage }),
}

export function editGalleryItemTC(updatePayload: UpdatePayloadType, itemId: string): ThunkType {
  return async (dispatch) => {
    try {
      dispatch(actions.requestAC())
      await API.admin.editGalleryItem(updatePayload, itemId)
      dispatch(actions.successAC())
    } catch (err: any) {
      const { errors, fail }: { errors: RequestBodyValidationErrorsType[], fail: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.failAC(errMsg))
        return
      }
      dispatch(actions.failAC(fail))
    }
  }
}