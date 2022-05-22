/* eslint-disable react-hooks/exhaustive-deps */
import styles from './DashboardPage.module.scss'
import { FC, useEffect } from 'react'
import { useTypedSelector } from '../../../05_Types/01_Base'

import { useScrollToTop } from '../../../04_Utils/hooks'
import { statisticThunk } from '../../../03_Reducers/Statistic/statisticReducer'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
export const DashboardPage: FC = () => {
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
  return <div className={`${styles.scroll} ${themeClass}`}></div>
}
