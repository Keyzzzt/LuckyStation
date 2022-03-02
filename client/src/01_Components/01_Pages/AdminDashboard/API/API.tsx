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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={styles.container}>
      {!apiInfo ? (
        <Loader />
      ) : (
        <div className={styles.accordion}>
          {
            // @ts-ignore
            apiInfo.map((item, i) => {
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
