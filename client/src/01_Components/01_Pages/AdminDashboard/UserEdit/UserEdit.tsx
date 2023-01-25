import { FC, useEffect, useState } from 'react'
import s from './userEdit.module.scss'
import globalStyles from '../../../../02_Styles/global.module.scss'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { getUserThunk } from '../../../../03_Reducers/admin/getUserReducer'
import { userDeleteThunk } from '../../../../03_Reducers/user/userDeleteReducer'
import { updateProfileByAdminThunk } from '../../../../03_Reducers/admin/updateProfileByAdminReducer'
import Loader from '../../../02_Chunks/Loader/Loader'
import { useScrollToTop } from '../../../../04_Utils/hooks'

type Props = {
  userId: string
}

export const UserEdit: FC<Props> = ({ userId }) => {
  const history = useHistory()
  const dispatch = useDispatch()

  // useScrollToTop()
  // const { userId } = useParams<{ userId: string }>()
  // const { success, loading, fail } = useTypedSelector(state => state.updateProfileByAdmin)

  const { user } = useTypedSelector(state => state.getUser)
  const [role, setRole] = useState(false)

  const handleDelete = (userId: string, email: string) => {
    if (window.confirm(`Are you sure you want to delete ${email}?`)) {
      dispatch(userDeleteThunk(userId))
      alert(`${email} has been removed`)
      history.push('/dashboard')
    }
    return
  }
  const handleUpdate = () => {
    dispatch(updateProfileByAdminThunk(userId, { isAdmin: role }))
  }
  const handleToggleAdminStatus = () => {
    // Ask in modal about confirmation
    // If confirmed, request server, if there is more than 1 admin,
    // if not, return with message that before this can be done, give Admin right to another user
    // setRole(role => !role)
    // When done, redirect to main page
  }
  useEffect(() => {
    dispatch(getUserThunk(userId))
  }, [userId])

  useEffect(() => {
    if (user) {
      setRole(() => user.isAdmin)
    }
  }, [user])

  return (
    <div className={s.container}>
      {!user ? (
        <Loader/>
      ) : (
        <>
          <table className={globalStyles.table}>
            <thead>
            <tr>
              <th>
                <div>Field</div>
              </th>
              <th>
                <div>Value</div>
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>ID</td>
              <td>{user._id}</td>
            </tr>
            <tr>
              <td>Name</td>
              <td>{user.name}</td>
            </tr>
            <tr>
              <td>Avatar</td>
              <td>TODO</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{user.email}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td>
                {user.isAdmin ? <div className={globalStyles.success}>Admin</div> : 'Customer'}
                <input onChange={handleToggleAdminStatus} type="checkBox" id="role" checked={role}/>
              </td>
            </tr>
            <tr>
              <td>Email confirmation</td>
              <td>{user.isActivated ? <div className={globalStyles.success}>Confirmed</div> :
                <div className={globalStyles.danger}>Not confirmed</div>}
              </td>
            </tr>
            <tr>
              <td>Subscription</td>
              <td>{user.isSubscribed ? <div className={globalStyles.success}>Subscribed for newsletter</div> :
                <div className={globalStyles.danger}>Not subscribed</div>}</td>
            </tr>
            <tr>
              <td>Favorites count</td>
              <td>{user.favorite.length}</td>
            </tr>
            <tr>
              <td>Created</td>
              <td>{user.createdAt}</td>
            </tr>
            </tbody>
          </table>
          <div className={s.buttons}>
            <button className={globalStyles.success} onClick={handleUpdate}>Update</button>
            <button className={globalStyles.danger} onClick={() => handleDelete(user._id, user.email)}>Delete User</button>
          </div>
        </>
      )}
    </div>

  )
}
