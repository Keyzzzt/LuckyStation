import { FC } from 'react'
import s from './users.module.scss'
import Loader from '../../../02_Chunks/Loader/Loader'
import { UserDataForListType } from '../../../../05_Types/ResponseTypes'
import { useNavigate } from 'react-router-dom'

// TODO Add sort
// TODO Polish styles

type Props = {
  setSortFilter: (filter: string) => void
  users: UserDataForListType[] | null
}


export const UsersList: FC<Props> = ({ users, setSortFilter }) => {
  const navigate = useNavigate()

  return (
    <div className={s.list}>
      {!users ? (
        <Loader/>
      ) : (
        <table className='stationTable'>
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
              <td>{u.isAdmin ? <div className='success'>Admin</div> : 'Customer'}</td>
              <td>{u.isActivated ? <div className='success'>Confirmed</div> : <div className='danger'>Not confirmed</div>}</td>
              <td>
                <button onClick={() => navigate(`/dashboard/users/${u._id}`)} className='success'>More info</button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
