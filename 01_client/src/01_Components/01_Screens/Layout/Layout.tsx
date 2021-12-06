import { Header } from '../../02_Chunks/01_Header/Header'
import { Footer } from '../../02_Chunks/Footer/Footer'
import styles from './Layout.module.scss'

export const Layout = ({ children }: any) => {
  return (
    <div>
      <Header />
      <div className={styles.container}>{children}</div>
      <Footer />
    </div>
  )
}
