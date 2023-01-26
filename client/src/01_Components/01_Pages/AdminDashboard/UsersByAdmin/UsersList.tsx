import { FC } from 'react'
import s from './users.module.scss'
import globalStyles from '../../../../02_Styles/global.module.scss'
import Loader from '../../../02_Chunks/Loader/Loader'
import { UserTypeForList } from '../../../../05_Types/APIResponse'
import { useNavigate } from 'react-router-dom'

// TODO Add sort
// TODO Polish styles

type Props = {
  setSortFilter: (filter: string) => void
  users: UserTypeForList[] | null
}


export const UsersList: FC<Props> = ({ users, setSortFilter }) => {
  const navigate = useNavigate()

  return (
    <div className={s.list}>
      {!users ? (
        <Loader/>
      ) : (
        <table className={globalStyles.table}>
          <thead>
          <tr>
            <th>
              <div>Name</div>
            </th>
            <th>
              <div>Email</div>
            </th>
            <th>
              <div>Status</div>
            </th>
            <th>
              <div>Email confirmation</div>
            </th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.isAdmin ? <div className={globalStyles.success}>Admin</div> : 'Customer'}</td>
              <td>{u.isActivated ? <div className={globalStyles.success}>Confirmed</div> : <div className={globalStyles.danger}>Not confirmed</div>}</td>
              <td>
                <button onClick={() => navigate(`/dashboard/users/${u._id}`)} className={globalStyles.success}>More info</button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
