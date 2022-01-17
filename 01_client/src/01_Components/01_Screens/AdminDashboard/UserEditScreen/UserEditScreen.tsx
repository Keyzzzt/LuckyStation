import { FC, useEffect, useState } from 'react'
import styles from './UserEditScreen.module.scss'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { getUserThunk } from '../../../../03_Reducers/admin/getUserReducer'
import { userDeleteThunk } from '../../../../03_Reducers/user/userDeleteReducer'
import { updateProfileByAdminThunk } from '../../../../03_Reducers/admin/updateProfileByAdminReducer'
// import { actions } from '../../../03_Reducers/admin/getUserReducer'
import Loader from '../../../02_Chunks/Loader/Loader'
import { useScrollToTop } from '../../../../04_Utils/hooks'
import { RedirectButton } from '../../../02_Chunks/BackButton/BackButton'

export const UserEditScreen: FC = () => {
  const history = useHistory()

  useScrollToTop()
  const dispatch = useDispatch()
  const { userId } = useParams<{ userId: string }>()
  const { success, loading, fail } = useTypedSelector((state) => state.updateProfileByAdmin)

  const { user, loading: loadingUser, fail: failUser } = useTypedSelector((state) => state.getUser)
  const [role, setRole] = useState(false)

  // TODO Проверить что происходит когда удалется залогиненный пользователь
  const userDeleteHandler = (userId: string, email: string) => {
    if (window.confirm(`Are you sure you want to delete ${email}?`)) {
      dispatch(userDeleteThunk(userId))
      alert(`${email} has been removed`)
      history.push('/dashboard')
    }
    return
  }
  const updateHandler = () => {
    dispatch(updateProfileByAdminThunk(userId, { isAdmin: role }))
  }
  useEffect(() => {
    dispatch(getUserThunk(userId))
  }, [userId])

  useEffect(() => {
    if (!user) {
      return
    }
    setRole(() => user.isAdmin)
  }, [user])

  return (
    <div className={styles.container}>
      <RedirectButton path="/dashboard">Back</RedirectButton>
      {!user ? (
        <Loader />
      ) : (
        <>
          <button onClick={updateHandler}>Update</button>
          <button onClick={() => userDeleteHandler(user._id, user.email)}>Delete User</button>
          <div>ID: {user._id}</div>
          <div>Email: {user.email}</div>
          <div>
            <img src={user.logo} alt="Logo" />
          </div>
          <div>
            <label htmlFor="role">{role ? 'Admin' : 'User'}</label>

            <input onChange={() => setRole((prev) => !prev)} type="checkBox" id="role" checked={role} />
          </div>
          {user.isActivated ? <div>Account is activated</div> : <div>Account not activated</div>}
          {user.isSubscribed ? <div>Subscribed for newsletter</div> : <div>Not subscribed</div>}
          <div>Credits: {user.credits}</div>
          <div>
            {user.favorite && user.favorite.map((item) => <div>{item}</div>)}
            {user.favorite?.length === 0 && <div>Favorite list is empty</div>}
          </div>
          <div>Created at: {user.createdAt}</div>
          <div>Updated at: {user.updatedAt}</div>
        </>
      )}
    </div>
  )
}
