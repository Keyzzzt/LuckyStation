import styles from './termsAndConditions.module.scss'
import { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { termsAndConditionsThunk } from '../../../03_Reducers/termsAndConditionsReducer'
import { useTypedSelector } from '../../../05_Types/01_Base'
import Loader from '../../02_Chunks/Loader/Loader'

export const TermsAndConditions: FC = () => {
  const { data } = useTypedSelector(state => state.termsAndConditions)
  const dispatch = useDispatch()
  const lang = 'en' // todo useState

  useEffect(() => {
    dispatch(termsAndConditionsThunk(lang))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={styles.container}>
      {!data ? (
        <Loader />
      ) : (
        <div className={styles.terms}>
          <div className={styles.mainTitle}>{data.mainTitle}</div>
          <div className={styles.paragraphTitle}>General information</div>
          <div className={styles.text}>{data.companyAddress.companyName}</div>
          <div className={styles.text}>{data.companyAddress.companyId}</div>
          <div className={styles.text}>{data.companyAddress.companyAddress}</div>
          <div className={styles.text}>{data.companyAddress.companyPhone}</div>
          <div className={styles.text}>{data.companyAddress.companyEmail}</div>
          {data.termsAndConditions.map((term, i) => {
            const textSeparation = term.paragraphText.split(';')
            return (
              <div key={i}>
                <div className={styles.paragraphTitle}>{term.paragraphTitle}</div>
                {textSeparation.map((text, i) => (
                  <div key={i} className={styles.text}>
                    {text.includes('<strong>') ? (
                      <div className={styles.boldText}>{text.trim().slice(8)}</div>
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
    </div>
  )
}
