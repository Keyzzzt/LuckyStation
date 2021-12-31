import { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { myOrdersThunk } from '../../../03_Reducers/user/myOrdersReducer'
import { updateOwnProfileThunk } from '../../../03_Reducers/user/userUpdateOwnProfileReducer'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { ErrorMessage } from '../../02_Chunks/ErrorMessage/ErrorMessage'
import Loader from '../../02_Chunks/Loader/Loader'
import styles from './ProfileScreen.module.scss'

export const ProfileScreen: FC = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { userInfo } = useTypedSelector((state) => state.userInfo)
  const { orders, error: meyOrdersErr } = useTypedSelector((state) => state.myOrders)
  const { loading, success, error } = useTypedSelector((state) => state.userUpdateOwnProfile)
  // const { email, logo, isSubscribed, credits, favorite, createdAt, updatedAt } = userInfo

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [message, setMessage] = useState('')

  const submitHandler = (e: any) => {
    e.preventDefault()
    if (newPassword !== confirmNewPassword) {
      setMessage('Passwords do not match')
    } else {
      dispatch(
        updateOwnProfileThunk({
          oldPassword,
          newPassword,
          confirmNewPassword,
        })
      )
    }
  }

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    } else {
      dispatch(myOrdersThunk(1, 5))
    }
  }, [history, userInfo])
  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        {error && <ErrorMessage message={error} />}
        {success && <ErrorMessage message={'Profile updated'} />}
        {loading && <Loader />}
        <div>
          <h1>User profile</h1>
        </div>
        {message && <ErrorMessage message={message} />}
        <form onSubmit={submitHandler}>
          <div>Email: {userInfo?.email}</div>
          <div>credits: {userInfo?.credits}</div>
          <div>{userInfo?.isAdmin ? 'Admin' : 'User'}</div>
          <div>
            <img src={userInfo?.logo} alt="" />
          </div>
          <div>{userInfo?.favorite.length! > 0 ? userInfo?.favorite.map((item) => <div>{item}</div>) : <div>Favorite list is empty</div>}</div>
          <div>
            <input onChange={(e) => setOldPassword(e.target.value)} type="password" value={oldPassword} placeholder="Old password" />
          </div>
          <div>
            <input onChange={(e) => setNewPassword(e.target.value)} type="password" value={newPassword} placeholder="New password" />
          </div>
          <div>
            <input
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              type="password"
              value={confirmNewPassword}
              placeholder="Confirm new password"
            />
          </div>
          <div>
            <input type="submit" value="Update" />
          </div>
        </form>
      </div>
      <div className={styles.orders}>
        {meyOrdersErr && <div>No Orders</div>}
        {orders &&
          orders.map((order) => (
            <div>
              <Link to={`/order/${order._id}`}>Order ID: {order._id}</Link>
            </div>
          ))}
      </div>
    </div>
  )
}
