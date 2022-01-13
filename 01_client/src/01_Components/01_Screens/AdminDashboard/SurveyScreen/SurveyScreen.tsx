import styles from './SurveyScreen.module.scss'
import { FC, useEffect, useState } from 'react'
import { isEmail } from '../../../../04_Utils/utils'

type Props = {
  allEmails: string[]
  subscribedEmails: string[]
}

// Проверять введенные имейлы на соответствие имейлу
export const SurveyScreen: FC<Props> = ({ allEmails, subscribedEmails }) => {
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [recipients, setRecipients] = useState('')
  const [emailsFromDB, setEmailsFromDB] = useState<'all' | 'subscribed' | ''>('')

  const isValidEmails = (str: string) => {
    let arr = str.split(',')
    let failedEmails = []
    for (let i = 0; i < arr.length; i++) {
      if (!isEmail(arr[i])) {
        failedEmails.push(arr[i])
      }
    }
    return failedEmails
  }

  const submitHandler = () => {
    if (title === '' || subject === '' || body === '' || recipients === '') {
      alert('Empty fields!!!')
      return
    }
    const isValid = isValidEmails(recipients)
    if (isValid.length === 0) {
      // TODO:
    } else {
      alert(`These emails are not valid: ${isValid.join(',')}`)
    }
  }

  return (
    <div className={styles.container}>
      <h1>Create new survey</h1>
      <div>
        <input onChange={(e) => setTitle(e.target.value)} type="text" value={title} placeholder="Survey title" />
      </div>
      <div>
        <input onChange={(e) => setSubject(e.target.value)} type="text" value={subject} placeholder="Survey subject" />
      </div>
      <div>
        <textarea cols={20} onChange={(e) => setBody(e.target.value)} value={body} placeholder="Survey text" />
      </div>
      <div>
        <textarea onChange={(e) => setRecipients(e.target.value)} value={recipients} placeholder="Recipients" />
        <button onClick={() => setRecipients(allEmails.join(','))}>Load all emails</button>
        <button onClick={() => setRecipients(subscribedEmails.join(','))}>Only subscribed users</button>
        <button onClick={() => setRecipients('')}>Clear</button>
      </div>
      <div>
        <button onClick={submitHandler}>Next</button>
      </div>
    </div>
  )
}
