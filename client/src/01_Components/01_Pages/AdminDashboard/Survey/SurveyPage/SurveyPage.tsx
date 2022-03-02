/* eslint-disable react-hooks/exhaustive-deps */
import styles from './SurveyPage.module.scss'
import { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { deleteSurveyThunk } from '../../../../../03_Reducers/admin/survey reducers/deleteSurveyReducer'
import { useHistory, useParams } from 'react-router'
import { singleSurveyThunk } from '../../../../../03_Reducers/admin/survey reducers/singleSurveyReducer'
import { useTypedSelector } from '../../../../../05_Types/01_Base'
import { actions } from '../../../../../03_Reducers/admin/survey reducers/deleteSurveyReducer'
import Loader from '../../../../02_Chunks/Loader/Loader'

type Props = {}

export const SurveyPage: FC<Props> = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { surveyId } = useParams<{ surveyId: string }>()
  const { survey } = useTypedSelector(state => state.singleSurvey)
  const { success: deleteSuccess } = useTypedSelector(state => state.deleteSurvey)

  const deleteHandler = (surveyId: string) => {
    if (!window.confirm('Are you sure you want to delete this survey?')) {
      return
    }
    dispatch(deleteSurveyThunk(surveyId))
  }

  useEffect(() => {
    if (!deleteSuccess) {
      return
    }
    alert('Deleted')
    history.push('/dashboard')
    dispatch(actions.reset())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteSuccess])

  useEffect(() => {
    dispatch(singleSurveyThunk(surveyId))
  }, [])

  return (
    <>
      {!survey ? (
        <Loader />
      ) : (
        <div className={styles.container}>
          <div>ID: {survey._id}</div>
          <div>User created this survey: {survey.user}</div>
          <div>Survey title: {survey.title}</div>
          <div>Survey subject: {survey.subject}</div>
          <div>Survey body: {survey.body}</div>
          <div>Yes answer: {survey.yes}</div>
          <div>No answer: {survey.no}</div>
          <div>Date sent: {survey.dateSent}</div>
          <button onClick={() => history.push('/dashboard')}>Back</button>
          <button onClick={() => deleteHandler(survey._id)}>Delete</button>
          <button onClick={() => history.push('/dashboard/survey/new')}>Create new</button>
        </div>
      )}
    </>
  )
}
