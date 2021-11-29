import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { userThunk } from '../03_Reducers/userReducers'

const actions = {
  ...userThunk,
}

export const useActions = () => {
  const dispatch = useDispatch()
  return bindActionCreators(actions, dispatch)
}
