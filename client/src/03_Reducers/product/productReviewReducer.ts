import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'
import { ReviewRequestType } from '../../05_Types/ResponseTypes'

type ThunkType = BaseThunkType<ActionType>
type InitialStateType = typeof initialState
type ActionType = InferActionTypes<typeof actions>

const initialState = {
  success: false,
  loading: false,
  fail: '',
}

export const productReviewReducer = (state = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'PRODUCT_REVIEW_REQUEST':
      return { ...initialState, loading: true }
    case 'PRODUCT_REVIEW_SUCCESS':
      return { ...initialState, success: true }
    case 'PRODUCT_REVIEW_FAIL':
      return { ...initialState, fail: action.payload }
    default:
      return state
  }
}

export const actions = {
  request: () => ({ type: 'PRODUCT_REVIEW_REQUEST' as const }),
  success: () => ({ type: 'PRODUCT_REVIEW_SUCCESS' as const }),
  fail: (errMessage: string) => ({ type: 'PRODUCT_REVIEW_FAIL' as const, payload: errMessage }),
}

export function productReviewThunk(productId: string, review: ReviewRequestType): ThunkType {
  return async (dispatch) => {
    try {
      dispatch(actions.request())
      await API.user.createReview(productId, review)
      dispatch(actions.success())
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
