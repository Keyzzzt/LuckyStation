import { FC } from 'react'
import { Link } from 'react-router-dom'
import styles from './ProductCard.module.scss'

type Props = {
  brand: string
  name: string
  price: number
  _id: string
}

export const ProductCard: FC<Props> = ({ brand, name, price, _id }) => {
  return (
    <div className={styles.col}>
      <Link to={`/product/${_id}`}>
        <img src="https://via.placeholder.com/150" alt="" />
      </Link>
      <div className={styles.brand}>{brand}</div>
      <div className={styles.name}>{name}</div>
      <div className={styles.price}>Price: {price}</div>
      <Link to={`/product/${_id}`} className={styles.buy}>
        Buy
      </Link>
    </div>
  )
}