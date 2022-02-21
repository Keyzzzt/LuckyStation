import styles from './NewProductsSection.module.scss'
import { FC } from 'react'
import { Button } from '../Button/Button'

type Props = {
  products: any[]
}

export const NewProductsSection: FC<Props> = ({ products }) => {
  return (
    <section className={styles.newProducts}>
      <div className={styles.newProductsContent}>
        <h1 className={styles.newProductsTitle}>CRAFTED WITH CARE SO YOUR BABY CAN SLEEP</h1>
        <div className="newProductsSlider"></div>
        <Button path="products" colorTheme="dark">
          EXPLORE NEW PRODUCTS
        </Button>
      </div>
    </section>
  )
}
