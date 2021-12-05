import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { userThunk } from '../03_Reducers/userReducers'
import axios from 'axios'

/**
 *! ===============================================================================================================================
 * @useActions
 ** Хук позволяет в целевой компоненте просто вызывать thunk без передачи его в dispatch
 ** Мы экономим только на строке const dispatch = useDispatch() в каждой компоненте.
 ** Но должны деструктуризировать const { loginUserThunk, registerUserThunk, logoutUserThunk } = useActions() + вызывать.
 ** Спорный хук который не используется в этом приложении, но нужно его знать если встречу в чужом коде.
 */
const actions = {
  ...userThunk,
}
export const useActions = () => {
  const dispatch = useDispatch()
  return bindActionCreators(actions, dispatch)
}

/**
 *! ===============================================================================================================================
 *  @useAutoFetch
 ** Хук запрашивает API при изменении входящих query & page
 ** В связке с компонетом InfiniteScroll получаем подгрузку новой порции данных с сервера, при прокрутке до последнего элемента.
 ** hasMore - параметр, который останавливает подгрузку если равен false.
 */
export function useAutoFetch(query, page) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [data, setData] = useState([])
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setData([])
  }, [query])

  useEffect(() => {
    setLoading(true)
    setError(false)

    let cancel
    axios({
      method: 'GET',
      url: 'http://openlibrary.org/search.json',
      params: {
        q: query,
        page,
      },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setData((prev) => {
          return [...new Set([...prev, ...res.data.docs.map((book) => book.title)])]
        })
        setHasMore(res.data.docs.length > 0)
        setLoading(false)
      })
      .catch((e) => {
        if (axios.isCancel(e)) return
        setError(true)
      })
    return () => cancel()
  }, [query, page])

  return { loading, error, data, hasMore }
}

/**
 *! ===============================================================================================================================
 *  @use
 **
 **
 **
 */
