import { FC } from 'react'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import styles from './ProductSales.module.scss'
import { SalesTable } from './SalesTable/SalesTable'

export const ProductSales: FC = () => {
  const { colorTheme } = useTypedSelector(state => state)
  // @ts-ignore
  const themeClass = colorTheme === 'light' ? styles.light_mode : styles.dark_mode
  return (
    <div className={`${styles.productsales} ${themeClass}`}>
      <div className={styles.productsales__header}>
        <h2 className={`${styles.productsales__header__title} ${themeClass}`}>Product Sales</h2>
      </div>
      <SalesTable />
    </div>
  )
}
