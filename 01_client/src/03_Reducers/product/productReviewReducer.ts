import { API } from '../../API'
import { BaseThunkType, InferActionTypes, IValErrMsg } from '../../05_Types/01_Base'

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
      return { ...initialState, success: true }
    case 'PRODUCT_REVIEW_SUCCESS':
      return { ...initialState, success: true }
    case 'PRODUCT_REVIEW_FAIL':
      return { ...initialState, fail: action.payload }
    default:
      return state
  }
}

export const actions = {
  productReviewRequestAC: () => ({ type: 'PRODUCT_REVIEW_REQUEST' as const }),
  productReviewSuccessAC: () => ({ type: 'PRODUCT_REVIEW_SUCCESS' as const }),
  productReviewFailAC: (errMessage: string) => ({ type: 'PRODUCT_REVIEW_FAIL' as const, payload: errMessage }),
}

export type ReviewToAPI = {
  rating: number
  comment: string
}

export function productReviewThunk(productId: string, review: ReviewToAPI): ThunkType {
  return async (dispatch) => {
    try {
      dispatch(actions.productReviewRequestAC())
      await API.user.createReview(productId, review)
      dispatch(actions.productReviewSuccessAC())
    } catch (err: any) {
      const { errors, error }: { errors: IValErrMsg[]; error: string } = err.response.data
      if (errors && errors.length > 0) {
        const errMsg = errors.map((e) => e.msg).join('; ')
        dispatch(actions.productReviewFailAC(errMsg))
        return
      }
      dispatch(actions.productReviewFailAC(error))
    }
  }
}
