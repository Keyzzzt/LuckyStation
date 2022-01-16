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
  const { userInfo } = useTypedSelector((state) => state.userInfo)
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

      {publicRotes.map((route) => (
        <Switch>
          <Route path={route.path} component={route.component} exact={route.exact} />
        </Switch>
      ))}

      {isAuth &&
        privateRotes.map((route) => (
          <Switch>
            <Route path={route.path} component={route.component} exact={route.exact} />
          </Switch>
        ))}
      {isAdmin &&
        adminRoutes.map((route) => (
          <Switch>
            <Route path={route.path} component={route.component} exact={route.exact} />
          </Switch>
        ))}
      <Redirect to="/" />
      <Footer isSubscribed={userInfo?.isSubscribed ? true : false} />
    </>
  )
}

// TODO: Тест приложения при отключенном API.
// TODO: Нужно реализовать некий принцип брони, чтобы 2 покупателя не купили последний оставшийся продукт.
// TODO: https://www.udemy.com/course/mern-ecommerce/learn/lecture/22498996#questions/12904054
// TODO Попробовать реализовать useFetch хук. https://www.youtube.com/watch?v=GNrdg3PzpJQ&t=3808s 1:50
// TODO сделать роуты для админа недоступными для остальных по типу как у Ulbi https://www.youtube.com/watch?v=GNrdg3PzpJQ&t=3808s 2:33
// TODO расставить везде вопросы user?.info?.profile?.name
// TODO Разобраться с "/:keyword?/:page?/:limit?"
// TODO Понять где нужен reset редюсера где нет

export default App
