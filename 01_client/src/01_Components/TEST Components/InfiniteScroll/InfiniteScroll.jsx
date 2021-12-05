import { useCallback, useRef, useState } from 'react'
import Loader from '../../Loader/Loader'
import { useAutoFetch } from '../../../04_Utils/hooks'



export const InfiniteScroll = () => {
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const {loading, error, data, hasMore} = useAutoFetch(query, page)
  const observer = useRef()
  const lastBookRef = useCallback(node => {
    if(loading) return
    if(observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && hasMore){
        setPage(prev => prev + 1)
      }
    })
    if(node) observer.current.observe(node)
  }, [loading, hasMore])

  function handleChange(e) {
    setQuery(e.target.value)
    setPage(1)
  }


  return (
    <div>
      <input onChange={handleChange} type="text" value={query}/>

      {data.map((item, index) => {
        if(data.length === index + 1){
          return <div ref={lastBookRef} key={item}>{item}</div>
        } else {
          return <div key={item}>{item}</div>
        }
      })}
      {loading && <Loader />} {/* FIXME: Крутится наверху страницы, поэтому его не видно, что плохо для UX */}
      {error && <div>Some error occured.</div>}
    </div>
  )

}

