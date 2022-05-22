/* eslint-disable react-hooks/exhaustive-deps */
/**
 * * Desc - admin dashboard
 * * Access - ADMIN
 * * Props - null
 * * Components to render -
 * ? TODO - page with menu and sidebar with selected page
 * ? TODO - fetch statistic to send different parts of it to different components
 * ! FIXME page with menu and sidebar with selected page
 */

import styles from './AdminDashboard.module.scss'
import { FC, useEffect } from 'react'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { useScrollToTop } from '../../../04_Utils/hooks'
import { RemoveEmailFromList } from './RemoveEmailFromList/RemoveEmailFromList'
import { statisticThunk } from '../../../03_Reducers/Statistic/statisticReducer'
import { useDispatch } from 'react-redux'
import { CreateSurvey } from './Survey/CreateSurvey/CreateSurvey'
import { useHistory } from 'react-router'

export const AdminDashboard: FC = () => {
  const { statistic } = useTypedSelector(state => state.statistic)
  const dispatch = useDispatch()
  const history = useHistory()

  useScrollToTop()
  const { colorTheme } = useTypedSelector(state => state)
  //@ts-ignore
  const themeClass = colorTheme === 'light' ? styles.light_mode : styles.dark_mode

  useEffect(() => {
    dispatch(statisticThunk())
  }, [])
  return (
    <div className={`${styles.scroll} ${themeClass}`}>
      <div className={`${styles.container} ${themeClass}`}>
        <button onClick={() => history.push('/dashboard/create')}>Create Product</button>
        <button onClick={() => history.push('/dashboard/users')}>Users list</button>
        <button onClick={() => history.push('/dashboard/products')}>Products list</button>
        <button onClick={() => history.push('/dashboard/orders')}>Orders list</button>
        <button onClick={() => history.push('/dashboard/api')}>API</button>
        <div className={`${styles.dashboard}`}>
          <div className={`${styles.adminToolUnit}`}>
            <CreateSurvey
              allEmails={statistic.allUsersEmailList}
              subscribedEmails={statistic.allSubscribersEmailList}
            />
            <RemoveEmailFromList />
          </div>
        </div>
      </div>
    </div>
  )
}
