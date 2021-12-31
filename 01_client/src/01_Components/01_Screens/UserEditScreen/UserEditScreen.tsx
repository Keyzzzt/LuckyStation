import { FC, useEffect, useState } from 'react'
import styles from './UserEditScreen.module.scss'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { getUserThunk } from '../../../03_Reducers/admin/getUserReducer'
import { userDeleteThunk } from '../../../03_Reducers/user/userDeleteReducer'
import { updateProfileByAdminThunk } from '../../../03_Reducers/admin/updateProfileByAdminReducer'
import { actions } from '../../../03_Reducers/admin/getUserReducer'
import Loader from '../../02_Chunks/Loader/Loader'
import { ErrorMessage } from '../../02_Chunks/ErrorMessage/ErrorMessage'
import { useScrollToTop } from '../../../04_Utils/hooks'

export const UserEditScreen: FC = () => {
  useScrollToTop()
  const dispatch = useDispatch()
  const { userId } = useParams<{ userId: string }>()
  const { success, loading, error } = useTypedSelector((state) => state.updateProfileByAdmin)

  const { userInfo } = useTypedSelector((state) => state.userInfo)
  const { _id, email, logo, isAdmin, isSubscribed, isActivated, credits, favorite, createdAt, updatedAt } = useTypedSelector(
    (state) => state.getUser.user
  )
  const [role, setRole] = useState(false)
  console.log('isAdmin: ', isAdmin)
  console.log('role: ', role)

  const history = useHistory()

  if (!userInfo) {
    history.push('/login?redirect=dashboard')
  }
  if (userInfo && !userInfo.isAdmin) {
    history.push('/')
  }

  // TODO Проверить что происходит когда удалется залогиненный пользователь
  const userDeleteHandler = (userId: string, email: string) => {
    if (window.confirm(`Are you sure you want to delete ${email}?`)) {
      dispatch(userDeleteThunk(userId))
      alert(`${email} has been removed`)
      history.push('/dashboard')
    }
    return
  }

  const returnHandler = () => {
    dispatch(actions.getUserResetAC())
    history.push('/dashboard')
  }

  const updateHandler = () => {
    dispatch(updateProfileByAdminThunk(_id, { isAdmin: role }))
  }
  useEffect(() => {
    dispatch(getUserThunk(userId))
  }, [dispatch, userId, success])
  useEffect(() => {
    setRole(() => isAdmin)
  }, [isAdmin])

  return (
    <div className={styles.container}>
      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}
      <button onClick={returnHandler}>Back</button>
      <button onClick={updateHandler}>Update</button>
      <button onClick={() => userDeleteHandler(_id, email)}>Delete User</button>
      <div>ID: {_id}</div>
      <div>Email: {email}</div>
      <div>
        <img src={logo} alt="Logo" />
      </div>
      <div>
        <label htmlFor="role">{role ? 'Admin' : 'User'}</label>

        <input onChange={() => setRole((prev) => !prev)} type="checkBox" id="role" checked={role} />
      </div>
      {isActivated ? <div>Account is activated</div> : <div>Account not activated</div>}
      {isSubscribed ? <div>Subscribed for newsletter</div> : <div>Not subscribed</div>}
      <div>Credits: {credits}</div>
      <div>
        {favorite && favorite.map((item) => <div>{item}</div>)}
        {favorite?.length === 0 && <div>Favorite list is empty</div>}
      </div>
      <div>Created at: {createdAt}</div>
      <div>Updated at: {updatedAt}</div>
    </div>
  )
}
