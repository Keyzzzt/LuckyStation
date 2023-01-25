import s from './usersByAdmin.module.scss'
import globalStyles from './../../../../02_Styles/global.module.scss'
import { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { Message } from '../../../02_Chunks/Message/Message'
import { PageType } from '../AdminDashboard'
import { usersListThunk } from '../../../../03_Reducers/user/userListReducer'
import { UsersList } from './UsersList'


// TODO Add sort
// TODO Polish styles

type Props = {
  setPage: (page: PageType) => void
  setUserId: (productId: string) => void
}

export const UsersByAdmin: FC<Props> = ({ setPage, setUserId }) => {
  const dispatch = useDispatch()
  const { users, fail } = useTypedSelector(state => state.userList)
  const deleteSuccess = useTypedSelector(state => state.userDelete.success)
  const [usersFilter, setUsersFilter] = useState<string>('all')
  const [usersToRender, setUsersToRender] = useState<any>(null)

  useEffect(() => {
    dispatch(usersListThunk(1, 10))
  }, [dispatch, deleteSuccess])

  useEffect(() => {
    if (users) setUsersToRender(users)
  }, [users])

  useEffect(() => {
    if (users) {
      switch (usersFilter) {
        // case 'nameAZ':
        //   return setProductsToRender([...users].sort((a, b) => a.name.localeCompare(b.name)))
        // case 'nameZA':
        //   return setProductsToRender([...users].sort((a, b) => b.name.localeCompare(a.name)))
        // case 'categoryAZ':
        //   return setProductsToRender([...users].sort((a, b) => a.category.localeCompare(b.category)))
        // case 'categoryZA':
        //   return setProductsToRender([...users].sort((a, b) => b.category.localeCompare(a.category)))
        // case 'brandAZ':
        //   return setProductsToRender([...users].sort((a, b) => a.brand.localeCompare(b.brand)))
        // case 'brandZA':
        //   return setProductsToRender([...users].sort((a, b) => b.brand.localeCompare(a.brand)))
        // case 'inStockAZ':
        //   return setProductsToRender([...users].sort((a, b) => a.countInStock - b.countInStock))
        // case 'inStockZA':
        //   return setProductsToRender([...users].sort((a, b) => b.countInStock - a.countInStock))
        // case 'lowestPriceFirst':
        //   return setProductsToRender([...users].sort((a, b) => a.price - b.price))
        // case 'highestPriceFirst':
        //   return setProductsToRender([...users].sort((a, b) => b.price - a.price))
        case 'all':
          return setUsersToRender([...users])
      }
    }
  }, [usersFilter])


  return (
    <div className={s.container}>
      {fail && <Message message={fail} type="fail"/>}
      {users?.length === 0 && <Message message='You have no users yet...' type="fail"/>}
      <div className={s.header}>
        <h2 className={s.title}>Users</h2>
      </div>
      <UsersList users={usersToRender} setSortFilter={setUsersFilter} setPage={setPage} setUserId={setUserId}/>
    </div>
  )
}