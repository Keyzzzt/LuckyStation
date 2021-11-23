import './App.css'
import { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { LoginForm } from './01_Components/LoginForm/LoginForm'
import { useDispatch, useSelector } from 'react-redux'
import { authenticate } from './03_Reducers/userReducers'
import { StateType } from './store'
import Loader from './01_Components/Loader/Loader'

const App = () => {
  const dispatch = useDispatch()
  const { isAuth, name, loading } = useSelector((state: StateType) => state.auth)

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(authenticate())
    }
  }, [])
  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Router>
            {isAuth ? name : 'Please log in'}
            <Switch>
              <Route exact path="/" render={() => <LoginForm />} />
            </Switch>
          </Router>
        </>
      )}
    </div>
  )
}

export default App
