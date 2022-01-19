import styles from './SurveyList.module.scss'
import { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../../../05_Types/01_Base'
import Loader from '../../../../02_Chunks/Loader/Loader'
import { useHistory } from 'react-router-dom'
import { surveyListThunk } from '../../../../../03_Reducers/admin/survey reducers/surveyListReducer'

export const SurveyList: FC = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { config } = useTypedSelector((state) => state)
  const { surveys, loading, fail } = useTypedSelector((state) => state.surveyList)

  useEffect(() => {
    dispatch(surveyListThunk())
  }, [])

  return (
    <div className={styles.container}>
      {/* {loading && <Loader />} */}
      {/* {error && <Message type="error" message={error} />} */}
      {!surveys ? (
        <Loader />
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Subject</th>
                <th>Yes</th>
                <th>No</th>
              </tr>
            </thead>
            <tbody>
              {surveys.map((x) => (
                <tr key={x._id} onClick={() => history.push(`/survey/${x._id}`)}>
                  <td>{x.title}</td>
                  <td>{x.subject}</td>
                  <td>{x.yes}</td>
                  <td>{x.no}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
