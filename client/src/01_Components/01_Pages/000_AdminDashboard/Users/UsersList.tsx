import { FC } from 'react'
import s from './users.module.scss'
import Loader from '../../../02_Chunks/Loader/Loader'
import { UserDataForListType } from '../../../../05_Types/ResponseTypes'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../02_Chunks/Button/Button'

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
              <td>{u.isAdmin ? (
                <Button title='Admin' type='button' color='success' minWidth='110px' padding='5px'/>
              ) : (
                'Customer'
              )}</td>
              <td>{u.isActivated ? (
                <Button title='Confirmed' type='button' color='success' minWidth='110px' padding='5px'/>
              ) : (
                <Button title='Not confirmed' type='button' color='danger' minWidth='110px' padding='5px'/>
              )}</td>
              <td>
                <Button onClick={() => navigate(`/dashboard/users/${u._id}`)} title='More info' type='button'
                        color='success' minWidth='110px'/>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
