import s from './userEdit.module.scss'
import { useParams } from 'react-router'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Loader from '../../../02_Chunks/Loader/Loader'
import { Button } from '../../../02_Chunks/Button/Button'
import { FC, FormEvent, useEffect } from 'react'
import { useScrollToTop } from '../../../../04_Utils/hooks'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { parseCreatedUpdated } from '../../../../04_Utils/utils'
import { getUserTC } from '../../../../03_Reducers/admin/getUserReducer'
import { userDeleteTC } from '../../../../03_Reducers/admin/userDeleteReducer'
import { setAdminStatusTC } from '../../../../03_Reducers/admin/setAdminStatusReducer'

export const UserEdit: FC = () => {
  const {success, loading, fail} = useTypedSelector(state => state.setAdminStatus)
  const { user } = useTypedSelector(state => state.getUser)
  const { userId } = useParams<string>()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useScrollToTop()

  const handleDelete = (userId: string, email: string) => {
    if (window.confirm(`Are you sure you want to delete ${email}?`)) {
      dispatch(userDeleteTC(userId))
      alert(`${email} has been removed`)
      navigate('/dashboard')
    }
    return
  }
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }


  const handleSetAsAdmin = (userId: string) => {
    if (userId && window.confirm('Are toy sure?')) {
      const role = !user?.isAdmin
      dispatch(setAdminStatusTC(userId, { isAdmin: role }))

    }
    // If confirmed, request server, if there is more than 1 admin,
    // if not, return with message that before this can be done, give Admin right to another user
    // setRole(role => !role)
    // When done, redirect to main page
  }
  useEffect(() => {
    if (userId) {
      dispatch(getUserTC(userId))
    }
  }, [userId])

  useEffect(() => {
    if (success && userId) {
      dispatch(getUserTC(userId))
    }
  }, [success])

  return (
    <div className={s.container}>
      {!user ? (
        <Loader/>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>{fail}</div>
          <table className='stationTable'>
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
                {user.isAdmin ? <Button title='Admin' type='button' color='success' minWidth='110px' padding='5px'/> : 'Customer'}
              </td>
            </tr>
            <tr>
              <td>Email confirmation</td>
              <td>{user.isActivated ? (
                <Button title='Confirmed' type='button' color='success' minWidth='110px' padding='5px'/>
              ) : (
                <Button title='Not confirmed' type='button' color='danger' minWidth='110px' padding='5px'/>
              )}
              </td>
            </tr>
            <tr>
              <td>Subscription</td>
              <td>{user.isSubscribed ? (
                <Button title='Subscribed' type='button' color='success' minWidth='110px' padding='5px'/>
              ) : (
                <Button title='Not subscribed' type='button' color='danger' minWidth='110px' padding='5px'/>
              )
              }</td>
            </tr>
            <tr>
              <td>Favorites count</td>
              <td>{user.favorite.length}</td>
            </tr>
            <tr>
              <td>Created</td>
              <td>{parseCreatedUpdated(user.createdAt, 'date&time')}</td>
            </tr>
            </tbody>
          </table>
          <div className={s.buttons}>

            <Button onClick={() => handleDelete(user._id, user.email)} title='Delete User' type='submit' color='danger'
                    minWidth='110px'/>
            {user.isAdmin ? (
              <Button onClick={() => handleSetAsAdmin(user._id)} title='Set as user' type='submit' color='danger'
                      minWidth='110px'/>
            ) : (
              <Button onClick={() => handleSetAsAdmin(user._id)} title='Set as admin' type='submit' color='danger'
                      minWidth='110px'/>

            )}
          </div>
        </form>
      )}
    </div>

  )
}
