import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'


/**
 *! ===============================================================================================================================
 *  @useWindowSize
 * * При каждом изменении окна, будет возвращать объект windowSize c шириной и высотой окна
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
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
