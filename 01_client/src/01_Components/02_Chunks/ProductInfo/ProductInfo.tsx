import React, { useState } from 'react'
import styles from './ProductInfo.module.scss'
import logo from '../../../img/logo.png'
import black from '../../../img/black.png'
import { Rating } from '../Rating/Rating'
import { useHistory, useParams } from 'react-router'

type Props = {
  isNewProduct?: boolean
  colors?: string[]
  sizes?: number[]
  price?: number
  id?: string
  brand?: string
  name?: string
  image?: string
  category?: string
  description?: string
  rating?: number
  numReviews?: number
  countInStock?: number
  reviews?: string[]
}

export const ProductInfo: React.FC<Props> = ({
  isNewProduct,
  colors,
  sizes,
  price,
  id,
  brand,
  name,
  image,
  category,
  description,
  rating,
  numReviews,
  countInStock,
  reviews,
}) => {
  const [color, setColor] = useState('#eb5757')
  const [size, setSize] = useState(0)
  const [qty, setQty] = useState(1)
  const params = useParams()
  const history = useHistory()
  //TODO: Если размер один, то загнать его в size

  const colorHandler = (color: string) => {
    setColor(color)
  }
  const sizeHandler = (size: number) => {
    setSize(size)
  }
  console.log(params)

  const addToCartHandler = () => {
    // @ts-ignore
    history.push(`/cart/${params.productId}?qty=${qty}`)
  }
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.leftSide}>
          <div className={styles.leftSideBackground} style={{ backgroundColor: color }} />
          <h1 className={styles.brand}>{brand}</h1>
          <img src={logo} alt="logo" className={styles.logo} />
          <a href="#" className={styles.share}>
            <i className="fas fa-share-alt" />
          </a>
          <img src={black} alt="" className={styles.productImage} />
        </div>
        <div className={styles.rightSide}>
          <div className={styles.productName}>
            <div>
              <h1 className={styles.big}>{brand}</h1>
              {isNewProduct && <span className={styles.new}>new</span>}
            </div>
            <h3 className={styles.small}>{name}</h3>
          </div>
          {colors && colors.length > 0 && (
            <div className={styles.colorContainer}>
              <h3 className={styles.title}>Color</h3>
              <div className={styles.colors}>
                {colors.map((c, i) => (
                  <span
                    onClick={() => colorHandler(c)}
                    className={`${styles.color} ${color === c ? styles.active : ''}`}
                    style={{
                      backgroundColor: c.toString(),
                      borderColor: '#fff',
                    }}
                  ></span>
                ))}
              </div>
            </div>
          )}
          {sizes && sizes.length > 0 && (
            <div className={styles.sizeContainer}>
              <h3 className={styles.title}>Size</h3>
              <div className={styles.sizes}>
                {sizes.map((s, i) => (
                  <span key={i} onClick={() => sizeHandler(s)} className={`${styles.size} ${size === s ? styles.active : ''}`}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
          <Rating value={rating} reviews={numReviews} />
          <div className={styles.description}>
            <h3 className={styles.title}>Description</h3>
            <p className={styles.text}>{description}</p>
          </div>
          {countInStock && countInStock > 0 ? (
            <div className={styles.quantity}>
              <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                {[...Array(countInStock).keys()].map((n) => (
                  <option key={id} value={n + 1}>
                    {n + 1}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          {countInStock === 0 ? (
            <div className={styles.buyPrice}>Out of stock</div>
          ) : (
            <div className={styles.buyPrice}>
              <button onClick={addToCartHandler} className={styles.buy}>
                <i className="fas fa-shopping-cart"></i>
                Add to cart
              </button>
              <div className={styles.price}>
                <h1>{`$ ${price}`}</h1>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
