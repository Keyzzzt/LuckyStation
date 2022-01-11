import { FC, useEffect } from 'react'
import { useHistory } from 'react-router'
import styles from './UsersList.module.scss'
import { useDispatch } from 'react-redux'
import { usersListThunk } from '../../../../03_Reducers/user/userListReducer'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { ErrorMessage } from '../../../02_Chunks/ErrorMessage/ErrorMessage'
import Loader from '../../../02_Chunks/Loader/Loader'
import { Link } from 'react-router-dom'
import { useIsAdminRedirect } from '../../../../04_Utils/hooks'

export const UsersList: FC = () => {
  const history = useHistory()
  const { userInfo } = useTypedSelector((state) => state.userInfo)
  useIsAdminRedirect(userInfo, history)

  const dispatch = useDispatch()
  const { config } = useTypedSelector((state) => state)
  const { users, loading, error } = useTypedSelector((state) => state.userList)
  const { success } = useTypedSelector((state) => {
    return state.userDelete
  })
  const themeClass = config.colorTheme === 'light' ? styles.light_mode : styles.dark_mode

  useEffect(() => {
    dispatch(usersListThunk(1, 10))
  }, [dispatch, success])
  return (
    <div className={`${styles.customerslist} ${themeClass}`}>
      {error && <ErrorMessage message={error} />}
      {loading && <Loader />}
      <div className={styles.customerslist__header}>
        <h2 className={`${styles.customerslist__header__title} ${themeClass}`}>Customers</h2>
      </div>
      <div className={styles.list}>
        {users?.map((user) => (
          <div key={user._id} className={styles.list__item}>
            <div className={styles.info}>
              <Link to={`/user/${user._id}/edit`} className={`${styles.name} ${themeClass}`}>
                {user._id}
              </Link>
              <span className={`${styles.email} ${themeClass}`}>{user.email}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
