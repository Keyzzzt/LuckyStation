import s from './subscribe.module.scss'
import React, { FC, FormEvent, useState } from 'react'
import image from './../../../../06_img/subscribe.webp'
import { isEmail } from '../../../../04_Utils/utils'
import { CustomInput } from '../../../02_Chunks/CustomInput/CustomInput'
import { API } from '../../../../API'


type Props = {
  setIsSubscribed: (value: boolean) => void
}
export const Subscribe: FC<Props> = ({ setIsSubscribed}) => {
  const [inputError, setInputError] = useState(false)
  const [resetIsDirty, setResetIsDirty] = useState(false)
  const [email, setEmail] = useState('')



  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isEmail(email)) {
      setInputError(false)
    } else {
      setInputError(true)
      return
    }
    try {
      await API.user.subscribe(email)
      localStorage.setItem('isSubscribed', JSON.stringify(true))
      alert('OK') // TODO Show modal
      setIsSubscribed(true)
      setResetIsDirty(true)
      setEmail('')
      setResetIsDirty(false)
    } catch (e) {
      alert('My bad!') // TODO Show modal
    }
  }
  return (
    <section className={s.localSection}>
      <div className={s.localContainer}>
        <div className={s.leftSide}>
          <h2 className='stationSectionTitle'>Sign up for our newsletter</h2>
          <p>Be among the first to receive exclusive offers, product news and more!</p>
          <form className={s.form} onSubmit={handleSubmit}>
            <CustomInput
              id=''
              label=''
              returnValue={setEmail}
              setInputError={setInputError}
              inputError={inputError}
              type="text"
              placeholder="Enter your email"
              name="email"
              value={email}
              resetIsDirty={resetIsDirty}
            />
            <input className='stationSubmitBtn' type="submit" value='Subscribe'/>

          </form>
        </div>
        <div className={s.image}>
          <img src={image} alt="image"/>
        </div>
      </div>
    </section>
  )
}
