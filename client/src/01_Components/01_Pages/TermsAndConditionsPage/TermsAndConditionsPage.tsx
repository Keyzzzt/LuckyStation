import s from './termsAndConditionsPage.module.scss'
import { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { termsAndConditionsThunk } from '../../../03_Reducers/termsAndConditionsReducer'
import { useTypedSelector } from '../../../05_Types/01_Base'
import Loader from '../../02_Chunks/Loader/Loader'

export const TermsAndConditionsPage: FC = () => {
  const { data } = useTypedSelector(state => state.termsAndConditions)
  const dispatch = useDispatch()
  const lang = 'en' // todo useState

  useEffect(() => {
    dispatch(termsAndConditionsThunk(lang))
  }, [])

  return (
    <main className={s.container}>
      {!data ? (
        <Loader />
      ) : (
        <div className={s.terms}>
          <div className={s.mainTitle}>{data.mainTitle}</div>
          <div className={s.paragraphTitle}>General information</div>
          <div className={s.text}>{data.companyAddress.companyName}</div>
          <div className={s.text}>{data.companyAddress.companyId}</div>
          <div className={s.text}>{data.companyAddress.companyAddress}</div>
          <div className={s.text}>{data.companyAddress.companyPhone}</div>
          <div className={s.text}>{data.companyAddress.companyEmail}</div>
          {data.termsAndConditions.map((term, i) => {
            const textSeparation = term.paragraphText.split(';')
            return (
              <div key={i}>
                <div className={s.paragraphTitle}>{term.paragraphTitle}</div>
                {textSeparation.map((text, i) => (
                  <div key={i} className={s.text}>
                    {text.includes('<strong>') ? (
                      <div className={s.boldText}>{text.trim().slice(8)}</div>
                    ) : (
                      text.trim()
                    )}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
