import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { Image } from '../../../05_Types/ResponseTypes'
import s from './productCard.module.scss'
import noImage from './../../../06_img/noImage.png'

// TODO If no images => show nofoto placeholder

type Props = {
  _id: string
  name: string
  price: number
  image: Image
}

export const ProductCard: FC<Props> = ({ name, price, _id, image }) => {
  return (
    <div className={s.productCard}>
      <Link to={`/product/${_id}`}>
        <img src={image ? image.imageSrc : noImage} alt={image?.imageAlt}/>
        <div className={s.name}>{name}</div>
        <div className={s.price}>Price: {price}</div>
      </Link>
    </div>
  )
}
