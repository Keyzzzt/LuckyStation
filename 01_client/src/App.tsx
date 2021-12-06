import { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { StateType } from './store'
// import { getCookie } from './04_Utils/getCookie'
import Loader from './01_Components/02_Chunks/Loader/Loader'
import { userThunk } from './03_Reducers/userReducers'
import { Header } from './01_Components/02_Chunks/01_Header/Header'
import { Layout } from './01_Components/01_Screens/Layout/Layout'
import { Home } from './01_Components/01_Screens/Home/Home'
import { Login } from './01_Components/01_Screens/Login/Login'
import { Contact } from './01_Components/01_Screens/Contact/Contact'
import { CTA } from './01_Components/01_Screens/CTA/CTA'

const App = () => {
  const { isAuth, email, loading, error } = useSelector((state: StateType) => state.auth)
  // const token = getCookie('accessToken')

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(userThunk.authenticate())
  }, [dispatch])
  return (
    <Layout>
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* <div>{isAuth ? email : 'Please log in'}</div>
            <div style={{ color: 'red' }}>{error && error}</div> */}
          <Switch>
            <Route exact path="/" render={() => <Home />} />
            <Route path="/login" render={() => <Login />} />
            <Route path="/contact" render={() => <Contact />} />
            <Route path="/cta" render={() => <CTA />} />
          </Switch>
        </>
      )}
    </Layout>
  )
}

// TODO: Тест приложения при отключенном API.

export default App
