import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { userInfoThunk } from '../../../03_Reducers/user/userInfoReducer'
import { useTypedSelector } from '../../../05_Types/01_Base'
import styles from './ProfileScreen.module.scss'

export const ProfileScreen: React.FC = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { userInfo } = useTypedSelector((state) => state.userInfo)
  const { isAuth, id } = useTypedSelector((state) => state.auth)

  useEffect(() => {
    if (!isAuth) {
      history.push('/login')
    } else {
      dispatch(userInfoThunk(id!))
    }
  }, [history, isAuth])
  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <div>
          <h1>User profile</h1>
        </div>
        <div>ID: {userInfo?._id}</div>
        <div>Email: {userInfo?.email}</div>
        <div>
          <img src={userInfo?.logo} alt="" />
        </div>
        <div>isAdmin: {userInfo?.isAdmin ? 'Yes' : 'No'}</div>
        <div>isActivated: {userInfo?.isActivated ? 'Yes' : 'No'}</div>
        <div>credits: {userInfo?.credits}</div>
        <div>
          favorite:{' '}
          {userInfo?.favorite.map((item) => (
            <div>{item}</div>
          ))}
        </div>
      </div>
      <div className={styles.orders}></div>
    </div>
  )
}
