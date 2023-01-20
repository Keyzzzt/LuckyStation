import { useEffect, useState } from 'react'
import { Switch, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Header } from './01_Components/02_Chunks/01_Header/Header'
import { Footer } from './01_Components/02_Chunks/Footer/Footer'
import { authenticateThunk } from './03_Reducers/user/userInfoReducer'
import { useTypedSelector } from './05_Types/01_Base'
import { publicRotes, privateRotes, adminRoutes } from './routes'
import { getRandom } from './04_Utils/utils'
import { configThunk } from './03_Reducers/appConfigReducer'

export const App = () => {
  const dispatch = useDispatch()
  // Получаем тут userInfo для того, чтобы сделать header & footer чистыми компонентами
  const { userInfo } = useTypedSelector(state => state.userInfo)
  const [isAuth, setIsAuth] = useState<boolean>(false)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  // Аутентификация при каждом запуске / перезагрезку приложения
  useEffect(() => {
    dispatch(authenticateThunk())
    dispatch(configThunk())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setIsAdmin(userInfo?.isAdmin ? true : false)
    setIsAuth(userInfo ? true : false)
  }, [userInfo])

  return (
    <>
      <Header isAuth={isAuth} isAdmin={isAdmin} />

      {publicRotes.map(route => (
        <Switch key={getRandom()}>
          <Route path={route.path} component={route.component} exact={route.exact} />
        </Switch>
      ))}

      {isAuth &&
        privateRotes.map(route => (
          <Switch key={getRandom()}>
            <Route path={route.path} component={route.component} exact={route.exact} />
          </Switch>
        ))}
      {isAdmin &&
        adminRoutes.map(route => (
          <Switch key={getRandom()}>
            <Route path={route.path} component={route.component} exact={route.exact} />
          </Switch>
        ))}
      <Footer isSubscribed={userInfo?.isSubscribed ? true : false} />
    </>
  )
}

export default App
