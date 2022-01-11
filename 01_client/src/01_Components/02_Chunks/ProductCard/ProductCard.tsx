import { FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../Loader/Loader'
import styles from './ProductCard.module.scss'

type Props = {
  brand: string
  name: string
  price: number
  _id: string
  isFavorite: boolean
  favoriteHandler: (productId: string, flag: string) => void
  favoriteLoading: boolean
}

export const ProductCard: FC<Props> = ({ brand, name, price, _id, isFavorite, favoriteHandler, favoriteLoading }) => {
  // const [flag, setFlag] = useState<boolean>(isFavorite)
  console.log(isFavorite)

  const toggle = () => {
    favoriteHandler(_id, 'add')
    // setFlag((prev) => !prev)
  }

  useEffect(() => {}, [])
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
      <div style={{ position: 'relative' }}>
        {favoriteLoading ? <Loader /> : !isFavorite ? <i onClick={toggle} className="far fa-heart" /> : <i className="fas fa-heart" />}
      </div>
    </div>
  )
}
