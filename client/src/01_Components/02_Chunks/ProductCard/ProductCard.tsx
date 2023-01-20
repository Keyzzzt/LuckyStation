import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { Image } from '../../../05_Types/APIResponse'
import s from './ProductCard.module.scss'

type Props = {
  _id: string
  name: string
  price: number
  isFavorite: boolean
  image: Image
  favoriteHandler: (productId: string, flag: boolean) => void
}

export const ProductCard: FC<Props> = ({ name, price, _id, isFavorite, image, favoriteHandler }) => {
  return (
    <div className={s.productCard}>
      <Link to={`/product/${_id}`}>
        <img src={image.imageSrc} alt={image.imageAlt}/>
        <div className={s.name}>{name}</div>
        <div className={s.price}>Price: {price}</div>
        <div className={s.favorite}>
          <i onClick={() => favoriteHandler(_id, isFavorite)} className={isFavorite ? 'fas fa-heart' : 'far fa-heart'}/>
        </div>
      </Link>
    </div>
  )
}
