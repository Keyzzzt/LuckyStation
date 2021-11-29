import './App.css'
import { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { LoginForm } from './01_Components/LoginForm/LoginForm'
import { useSelector } from 'react-redux'
import { StateType } from './store'
import Loader from './01_Components/Loader/Loader'
import { useActions } from './04_Utils/hooks'
import { MainScreen } from './01_Components/MainScreen'
import { getCookie } from './04_Utils/getCookie'

const App = () => {
  const { isAuth, email, loading, error } = useSelector((state: StateType) => state.auth)
  const token = getCookie('accessToken')

  const { authenticateThunk } = useActions()

  useEffect(() => {
    authenticateThunk()
  }, [])
  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Router>
            <div>{isAuth ? email : 'Please log in'}</div>
            <div>{error && error}</div>

            <Switch>
              <Route exact path="/" render={() => <LoginForm />} />
              <Route exact path="/main" render={() => <MainScreen />} />
            </Switch>
          </Router>
        </>
      )}
    </div>
  )
}

export default App
