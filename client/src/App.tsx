import { useEffect, useState } from 'react'
import { Redirect, Switch, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Header } from './01_Components/02_Chunks/Header/Header'
import { Footer } from './01_Components/02_Chunks/Footer/Footer'
import { authenticateThunk } from './03_Reducers/user/userInfoReducer'
import { useTypedSelector } from './05_Types/01_Base'
import { publicRotes, privateRotes, adminRoutes } from './routes'

const App = () => {
  const dispatch = useDispatch()
  // Получаем тут userInfo чтобы сделать header & footer чистыми компонентами
  const { userInfo } = useTypedSelector(state => state.userInfo)
  const [isAuth, setIsAuth] = useState<boolean>(false)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  // Аутентификация при каждом запуске / перезагрезку приложения
  useEffect(() => {
    dispatch(authenticateThunk())
  }, [])

  useEffect(() => {
    setIsAdmin(userInfo?.isAdmin ? true : false)
    setIsAuth(userInfo ? true : false)
  }, [userInfo])

  return (
    <>
      <Header isAuth={isAuth} isAdmin={isAdmin} />

      {publicRotes.map(route => (
        <Switch>
          <Route path={route.path} component={route.component} exact={route.exact} />
        </Switch>
      ))}

      {isAuth &&
        privateRotes.map(route => (
          <Switch>
            <Route path={route.path} component={route.component} exact={route.exact} />
          </Switch>
        ))}
      {isAdmin &&
        adminRoutes.map(route => (
          <Switch>
            <Route path={route.path} component={route.component} exact={route.exact} />
          </Switch>
        ))}
      <Footer isSubscribed={userInfo?.isSubscribed ? true : false} />
    </>
  )
}

export default App