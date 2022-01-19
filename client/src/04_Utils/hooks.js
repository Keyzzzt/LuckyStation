import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router'

/**
 *! ===============================================================================================================================
 *  @useAutoFetch
 ** Хук запрашивает API при изменении входящих query & page
 ** В связке с компонетом InfiniteScroll получаем подгрузку новой порции данных с сервера, при прокрутке до последнего элемента.
 ** hasMore - параметр, который останавливает подгрузку если равен false, в моем api это отсутствие поля next в ответе
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
 *  @useWindowSize
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

/**
 *! ===============================================================================================================================
 *  @useScrollToTop - скролит страницу наверх
 */

export function useScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/**
 *! ===============================================================================================================================
 *  @useIsAdminRedirect - проверяет является ли пользователь админом, если нет:
 * Залогиненного пользователя редиректит на главную
 * Не залогиненного редиректит на страницу логина
 */

// export function useIsAdminRedirect(userInfo, history) {
//   useEffect(() => {
//     if (!userInfo) {
//       history.push('/login?redirect=dashboard')
//     }
//     if (userInfo && !userInfo.isAdmin) {
//       history.push('/')
//     }
//   }, [userInfo, history])
// }

/**
 *! ===============================================================================================================================
 *  @useSelectByFilter - сортирует массив на основе filter, возвращает отсортированный массив
 */
export const useSelectByFilter = (items, filter) => {
  const sortedItems = useMemo(() => {
    // console.log('getSortedPosts')

    if (filter.sort) {
      //@ts-ignore
      return [...items].sort((a, b) => a[filter.sort].localeCompare(b[filter.sort]))
    }
    return items
  }, [filter.sort, items])
  return sortedItems
}

/**
 *! ===============================================================================================================================
 *  @useSelectByFilter - сортирует массив на основе filter, и применяет к отсортированному массиву поиск из query
 */
export const useSelectByFilterAndQuery = (items, filter, query) => {
  const sortedItems = useSelectByFilter(items, filter)
  const sortedAndSearchedItems = useMemo(() => {
    return sortedItems.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
  }, [query, sortedItems])
  return sortedAndSearchedItems
}

/**
 *! ===============================================================================================================================
 *  @useFetch - замудренный способ подгурзки данных. Хотя, нам не нужно диспачить в этом случае Loading и error... и держать их в state,
 * не нужно и обнулять ошибку в глобальном state
 */
// Создаем хук
export const useFetch = (callback) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = ['']
  const fetching = async (...args) => {
    try {
      setLoading(true)
      await callback(...args)
    } catch (e) {
      setError(e.error)
    } finally {
      setLoading(false)
    }
  }
  return [fetching, loading, error]
}
// Использование

// const [data, setData] = useState([])

// const [fetching, loading, error] = useFetch(() => {
//   const { data } = axios.get('some api')
//   setData(data)
// })

// useEffect(() => {
//   fetching()
// }, [])

/**
 *! ===============================================================================================================================
 *  @useInput -
 * @useValidation - Связка для формы, на сайте не использую, поскольку пока не дорос, НЕ ДОДЕЛАНЫ!!!
 * @Видео - https://www.youtube.com/watch?v=BGKbJ2aXCog
 */

//

export const useInput = (initialValue, validations) => {
  const [value, setValue] = useState(initialValue)
  const [isDirty, setIsDirty] = useState(false)
  const valid = useValidation(value, validations)

  const onChange = (e) => {
    setValue(e.target.value)
  }
  const onBlur = () => {
    setIsDirty(true)
  }
  return { value, onChange, onBlur, isDirty, ...valid }
}

export const useValidation = (value, validations) => {
  const [minLengthError, setMinLengthError] = useState(true)
  const [isEmpty, setIsEmpty] = useState(true)
  useEffect(() => {
    for (const validation in validations) {
      switch (validation) {
        case 'minLength':
          value.length < validations[validation] ? setMinLengthError(true) : setMinLengthError(false)
          break
        case 'isEmpty':
          value ? setIsEmpty(false) : setIsEmpty(true)
          break
        default:
          break
      }
    }
    return {
      minLengthError,
      isEmpty,
    }
  }, [value])
}
