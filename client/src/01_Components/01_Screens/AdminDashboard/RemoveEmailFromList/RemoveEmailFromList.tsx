import styles from './RemoveEmailFromList.module.scss'
import { FC, useState } from 'react'
import { useDispatch } from 'react-redux'

import { isEmail } from '../../../../04_Utils/utils'
import { removeEmailThunk } from '../../../../03_Reducers/Statistic/statisticReducer'

export const RemoveEmailFromList: FC = () => {
  const [email, setEmail] = useState('')
  const dispatch = useDispatch()

  const removeEmailHandler = () => {
    const checkEmail = isEmail(email)
    if (!checkEmail || email === '') {
      alert('Email not valid')
      return
    }
    dispatch(removeEmailThunk(email))
    setEmail('')
  }
  return (
    <div className={styles.container}>
      <div>
        <div>This option used for remove email from data base, once you removed it you can't roll this back</div>
        <input onChange={(e) => setEmail(e.target.value)} type="text" value={email} />
        <button onClick={removeEmailHandler}>Remove</button>
      </div>
    </div>
  )
}
