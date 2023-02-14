import s from './profilePage.module.scss'
import { FormEvent, FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { myOrdersTC } from '../../../03_Reducers/user/myOrdersReducer'
import { updateOwnProfileTC } from '../../../03_Reducers/user/userUpdateOwnProfileReducer'
import { useTypedSelector } from '../../../05_Types/01_Base'
import Loader from '../../02_Chunks/Loader/Loader'
import { Message } from '../../02_Chunks/Message/Message'

export const ProfilePage: FC = () => {
  const dispatch = useDispatch()
  const { userInfo } = useTypedSelector(state => state.userInfo)
  const { orders, fail: meyOrdersErr } = useTypedSelector(state => state.myOrders)
  const { success, fail } = useTypedSelector(state => state.userUpdateOwnProfile)

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [message, setMessage] = useState('')

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newPassword !== confirmNewPassword) {
      setMessage('Passwords do not match')
    } else {
      dispatch(
        updateOwnProfileTC({
          oldPassword,
          newPassword,
          confirmNewPassword,
        })
      )
    }
  }

  useEffect(() => {
    dispatch(myOrdersTC(1, 1))
  }, [dispatch])

  return (
    <main className={`stationContainer ${s.container}`}>
      <div className={s.profile}>
        {fail && <Message message={fail} type="fail" />}
        {success && <Message message={'Profile updated'} type="success" />}
        <div>
          <h1>User profile</h1>
        </div>
        <form onSubmit={submitHandler}>
          {!userInfo ? (
            <Loader />
          ) : (
            <>
              <div>Name: {userInfo.name}</div>
              <div>Email: {userInfo.email}</div>
              {userInfo.isAdmin ? <div>Admin</div> : null}
              <div>
                <img src={userInfo.logo} alt="" />
              </div>
              <div>
                {userInfo.favorite.length! > 0 ? (
                  userInfo.favorite.map(item => <div>{item}</div>)
                ) : (
                  <div>Favorite list is empty</div>
                )}
              </div>
              <div>
                <input
                  onChange={e => setOldPassword(e.target.value)}
                  type="password"
                  value={oldPassword}
                  placeholder="Old password"
                />
              </div>
              <div>
                <input
                  onChange={e => setNewPassword(e.target.value)}
                  type="password"
                  value={newPassword}
                  placeholder="New password"
                />
              </div>
              <div>
                <input
                  onChange={e => setConfirmNewPassword(e.target.value)}
                  type="password"
                  value={confirmNewPassword}
                  placeholder="Confirm new password"
                />
              </div>
              <div>
                <input type="submit" value="Change Password" />
              </div>
            </>
          )}
        </form>
      </div>
      <div className={s.orders}>
        {meyOrdersErr && <div>No Orders</div>}
        {orders &&
          orders.map(order => (
            <div>
              <Link to={`/order/${order._id}`}>Order ID: {order._id}</Link>
            </div>
          ))}
      </div>
    </main>
  )
}
