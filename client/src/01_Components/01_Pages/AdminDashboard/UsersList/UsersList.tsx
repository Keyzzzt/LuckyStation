import { FC, useEffect, useState } from 'react'
import s from './UsersList.module.scss'
import globalStyles from './../../../../02_Styles/global.module.scss'
import { useDispatch } from 'react-redux'
import { usersListThunk } from '../../../../03_Reducers/user/userListReducer'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { Message } from '../../../02_Chunks/Message/Message'
import Loader from '../../../02_Chunks/Loader/Loader'
import { PageType } from '../AdminDashboard'

// TODO Add sort
// TODO Polish styles

type Props = {
  setPage: (value: PageType) => void
  setUserId: (userId: string) => void
}


export const UsersList: FC<Props> = ({setPage, setUserId}) => {
  const dispatch = useDispatch()
  const { users, fail } = useTypedSelector(state => state.userList)
  const { success } = useTypedSelector(state => state.userDelete)


  const handleShowUser = (userId: string) => {
    setUserId(userId)
    setPage('userEditScreen')
  }

  useEffect(() => {
    dispatch(usersListThunk(1, 10))
  }, [dispatch, success])
  return (
    <div className={s.usersList}>
      {fail && <Message message={fail} type="fail"/>}
      <div className={s.header}>
        <h2 className={s.title}>Users</h2>
      </div>
      <div className={s.list}>
        {!users ? (
          <Loader/>
        ) : (
          users.map(u => (
            <div key={u._id} onClick={() => handleShowUser(u._id)} className={s.listItem}>
              <div>Email: {u.email}</div>
              <div>Name: {u.name}</div>
              {u.isAdmin ? <div>Status: Admin</div> : <div>Status: User</div>}
              {u.isActivated ? <div className={globalStyles.success}>Activated</div> : <div className={s.danger}>Not Activated</div>}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
