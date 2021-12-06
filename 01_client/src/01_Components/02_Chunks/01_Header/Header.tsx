import { useEffect, useState } from 'react'
import styles from './Header.module.scss'
import { BiMenuAltRight } from 'react-icons/bi'
import { AiOutlineClose } from 'react-icons/ai'
import { Link, useHistory } from 'react-router-dom'

export const Header = () => {
  const history = useHistory()
  const [menuOpen, setMenuOpen] = useState(false)
  const [size, setSize] = useState({
    width: undefined as number | undefined,
    height: undefined as number | undefined,
  })

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  useEffect(() => {
    if (size.width! > 768 && menuOpen) {
      setMenuOpen(false)
    }
  }, [size.width, menuOpen])

  const toggleMenuHandler = () => {
    setMenuOpen((prev) => !prev)
  }
  const ctaHandler = () => {
    toggleMenuHandler()
    history.push('/cta')
  }
  return (
    <header className={styles.header}>
      <div className={styles.header__content}>
        <Link to="/" className={styles.header__content__logo}>
          LOGO
        </Link>

        <nav className={`${styles.header__content__nav} ${menuOpen && size.width! < 768 ? styles.isMenu : ''}`}>
          <ul>
            <li>
              <Link to="/" onClick={toggleMenuHandler}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={toggleMenuHandler}>
                Contact
              </Link>
            </li>
            <li>
              <Link to="/login" onClick={toggleMenuHandler}>
                Login
              </Link>
            </li>
          </ul>
          <button onClick={ctaHandler}>CTA Page</button>
        </nav>
        <div className={styles.header__content__toggle}>{menuOpen ? <AiOutlineClose onClick={toggleMenuHandler} /> : <BiMenuAltRight onClick={toggleMenuHandler} />}</div>
      </div>
    </header>
  )
}
