/**
 * * Desc - Temporary component to show API docs
 * * Access - ADMIN
 * * Props - null
 * * Components to render - <Loader />, <RedirectButton />
 * ? TODO - fetch api docs
 * ? TODO - display api docs as accordion.
 * ! FIXME API docs comes as an array with bunch strings in it. Use another data structure and remove if statement from map function.
 */

import styles from './API.module.scss'
import { FC, useEffect, useState } from 'react'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { useDispatch } from 'react-redux'
import { apiThunk } from '../../../../03_Reducers/admin/apiReducer'
import Loader from '../../../02_Chunks/Loader/Loader'

export const API: FC = () => {
  const [selected, setSelected] = useState<number | null>(null)
  const { apiInfo } = useTypedSelector(state => state.api)
  const dispatch = useDispatch()

  const toggleHandler = (i: number) => {
    if (i === selected) {
      return setSelected(null)
    }
    setSelected(i)
  }

  useEffect(() => {
    dispatch(apiThunk())
  }, [dispatch])

  return (
    <div className={styles.container}>
      {!apiInfo ? (
        <Loader />
      ) : (
        <div className={styles.accordion}>
          {
            // @ts-ignore
            apiInfo.map((item, i: number) => {
              if (typeof item === 'string') {
                return null
              }
              return (
                <div key={i} className={`${styles.item} ${styles[item.access]}`}>
                  <div onClick={() => toggleHandler(i)} className={styles.title}>
                    <h2>{item.action}</h2>
                    <span>{selected === i ? '-' : '+'}</span>
                  </div>
                  <div className={`${styles.content} ${selected === i ? styles.show : ''}`}>
                    <pre>{JSON.stringify(item, null, 7)}</pre>
                  </div>
                </div>
              )
            })
          }
        </div>
      )}
    </div>
  )
}
