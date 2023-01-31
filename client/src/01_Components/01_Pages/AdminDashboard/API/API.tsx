import s from './api.module.scss'
import React, { FC, useEffect, useState } from 'react'
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
    <div className={s.api}>
      {!apiInfo ? (
        <Loader />
      ) : (
        <div className={s.accordion}>
          {
            // @ts-ignore
            apiInfo.map((item, i: number) => {
              if (typeof item === 'string') {
                return null
              }
              return (
                <div key={i} className={`${s.item} ${s[item.access]}`}>
                  <div onClick={() => toggleHandler(i)} className={s.title}>
                    <span>{item.action}</span>
                    <span>{selected === i ? '-' : '+'}</span>
                  </div>
                  <div className={`${s.content} ${selected === i ? s.show : ''}`}>
                    <pre>{JSON.stringify(item, null, 2)}</pre>
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
