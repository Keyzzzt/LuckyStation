import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useTypedSelector } from '../../../05_Types/01_Base'
import styles from './ProfileScreen.module.scss'

export const ProfileScreen: React.FC = () => {
  const history = useHistory()
  const { userInfo } = useTypedSelector((state) => state.userInfo)

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
  }, [history, userInfo])
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
