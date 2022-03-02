import styles from './CreateSurvey.module.scss'
import { FC, ChangeEvent, useState, useEffect } from 'react'
import { isEmail } from '../../../../../04_Utils/utils'
import { useDispatch } from 'react-redux'
import { createSurveyThunk } from '../../../../../03_Reducers/admin/survey reducers/createSurveyReducer'
import { SurveyList } from '../SurveyList/SurveyList'

type Props = {
  allEmails: string[]
  subscribedEmails: string[]
}

// todo поля с валидацией как в логин форме
// todo Перед отпарвкой запросить пароль

export const CreateSurvey: FC<Props> = ({ allEmails, subscribedEmails }) => {
  const [title, setTitle] = useState('New survey')
  const [subject, setSubject] = useState('New products in stock')
  const [body, setBody] = useState('Would you buy new coffee?')
  const [recipients, setRecipients] = useState('tallinnn@hotmail.com , keyzzzt@gmail.com, tallinnn@hotmail.com .,')
  const [validationOK, setValidationOK] = useState(false)
  const dispatch = useDispatch()

  const isValidEmails = (str: string) => {
    let arr = str.split(',')
    let failedEmails = []
    for (let i = 0; i < arr.length; i++) {
      if (!isEmail(arr[i].trim())) {
        if (arr[i] !== '') {
          failedEmails.push(arr[i])
        }
      }
    }
    return failedEmails
  }

  const removeInvalidEmails = () => {
    const isValid = isValidEmails(recipients)

    if (isValid.length > 0) {
      const message =
        isValid.length === 1
          ? `${isValid.join(',')} is not valid. Would you like to remove it?`
          : `These emails are not valid:\n${isValid.map(x => `${x}\n`)} Would you like to remove these?`
      const autoRemove = window.confirm(message)
      if (!autoRemove) {
        setValidationOK(false)
        return
      }
      setRecipients(prev => {
        return prev
          .split(',')
          .filter(x => !isValid.includes(x))
          .join(',')
      })
      setValidationOK(true)
      return
    }
    alert('All emails are valid')
    setValidationOK(true)
  }

  const recipientsHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValidationOK(false)
    setRecipients(e.target.value)
  }

  const submitHandler = () => {
    if (title === '' || subject === '' || body === '' || recipients === '') {
      alert('Empty fields!!!')
      return
    }
    if (!validationOK) {
      alert('Please use "Check emails" before submitting.')
      return
    }
    if (window.confirm('All emails seems to be good, are you sure you want to send survey now?')) {
      dispatch(
        createSurveyThunk({
          title,
          subject,
          body,
          recipients,
        })
      )
      alert('Survey created')
      setBody('')
      setRecipients('')
      setSubject('')
      setTitle('')
      setValidationOK(false)
    }
  }

  useEffect(() => {
    const normalizedRecipients = recipients
      .split(',')
      .map(x => x.trim())
      .filter(x => x !== '')
      .join(',')
    setRecipients(normalizedRecipients)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validationOK])
  return (
    <div className={styles.container}>
      <h1>Create new survey</h1>
      <div>
        <input onChange={e => setTitle(e.target.value)} type="text" value={title} placeholder="Survey title" />
      </div>
      <div>
        <input onChange={e => setSubject(e.target.value)} type="text" value={subject} placeholder="Survey subject" />
      </div>
      <div>
        <textarea cols={50} rows={5} onChange={e => setBody(e.target.value)} value={body} placeholder="Survey text" />
      </div>
      <div>
        <div>
          <textarea cols={50} rows={5} onChange={recipientsHandler} value={recipients} placeholder="Recipients" />
        </div>
        <div>
          <button onClick={() => setRecipients(allEmails.join(','))}>Load all emails</button>
        </div>
        <div>
          <button onClick={() => setRecipients(subscribedEmails.join(','))}>Only subscribed users</button>
        </div>
        <div>
          <button onClick={() => setRecipients('')}>Clear</button>
        </div>
        <div>
          <button onClick={removeInvalidEmails}>Check emails</button>
        </div>
      </div>
      <div>
        <button onClick={submitHandler}>Send</button>
      </div>
      <div>Surveys</div>
      <SurveyList />
    </div>
  )
}
