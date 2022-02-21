/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, FormEvent, useEffect, useState } from 'react'
import styles from './ProductScreen.module.scss'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { useDispatch } from 'react-redux'
import { productInfoThunk } from '../../../03_Reducers/product/productInfoReducer'
import { useHistory, useParams } from 'react-router'
import { Rating } from '../../02_Chunks/Rating/Rating'
import { productReviewThunk } from '../../../03_Reducers/product/productReviewReducer'
import { getRandom } from '../../../04_Utils/utils'
import Loader from '../../02_Chunks/Loader/Loader'

export const ProductScreen: FC = () => {
  const { userInfo } = useTypedSelector(state => state.userInfo)
  const { productInfo, fail } = useTypedSelector(state => state.productInfo)
  const {
    success: successReview,
    loading: loadingReview,
    fail: failReview,
  } = useTypedSelector(state => state.productReview)
  const history = useHistory()
  const dispatch = useDispatch()
  const { productId } = useParams<{ productId: string }>()
  const alreadyReviewed = productInfo?.reviews.find(review => review.user === userInfo?._id)
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const addToCartHandler = () => {
    history.push(`/cart/${productId}?qty=${qty}`)
  }

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // todo Валидация сообщения
    dispatch(productReviewThunk(productId, { rating, comment }))
  }

  useEffect(() => {
    if (!productInfo || productId !== productInfo._id || successReview) {
      dispatch(productInfoThunk(productId))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, successReview])
  return (
    <div className={styles.container}>
      {!productInfo ? (
        <Loader />
      ) : (
        <div className={styles.card}>
          <div className={styles.leftSide}>
            <div className={styles.leftSideBackground} />
            <h1 className={styles.brand}>{productInfo.brand}</h1>
            <img src="" alt="logo" className={styles.logo} />
            <a href="#" className={styles.share}>
              <i className="fas fa-share-alt" />
            </a>
            <img src={productInfo.image} alt="" className={styles.productImage} />
          </div>
          <div className={styles.rightSide}>
            <div className={styles.productName}>
              <div>
                <h1 className={styles.big}>{productInfo.brand}</h1>
                {productInfo.isNewProduct && <span className={styles.new}>new</span>}
              </div>
              <h3 className={styles.small}>{productInfo.name}</h3>
            </div>
            <Rating value={productInfo.rating} reviews={productInfo.numReviews} />
            <div className={styles.description}>
              <h3 className={styles.title}>Description</h3>
              <p className={styles.text}>{productInfo.description}</p>
            </div>
            {productInfo.countInStock && productInfo.countInStock > 0 ? (
              <div className={styles.quantity}>
                <select value={qty} onChange={e => setQty(Number(e.target.value))}>
                  {[...Array(productInfo.countInStock).keys()].map(n => (
                    <option key={getRandom()} value={n + 1}>
                      {n + 1}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            {productInfo.countInStock === 0 ? (
              <div className={styles.buyPrice}>Out of stock</div>
            ) : (
              <div className={styles.buyPrice}>
                <button onClick={addToCartHandler} className={styles.buy}>
                  <i className="fas fa-shopping-cart"></i>
                  Add to cart
                </button>
                <div className={styles.price}>
                  <h1>{`$ ${productInfo.price}`}</h1>
                </div>
              </div>
            )}
            {productInfo.reviews.length === 0 ? (
              <div>No reviews</div>
            ) : (
              productInfo.reviews.map(r => (
                <div>
                  <div className={styles.review}>
                    <div>Rated: {r.rating}</div>
                    <div>User: {r.name}</div>
                    <div>{r.comment}</div>
                  </div>
                </div>
              ))
            )}
            {!userInfo ? (
              <div>Please login to create review</div>
            ) : alreadyReviewed ? (
              <div>You have already reviewed this product with rating {alreadyReviewed.rating}</div>
            ) : (
              <form onSubmit={submitHandler} className={styles.reviewForm}>
                <input onChange={e => setComment(e.target.value)} type="text" value={comment} />
                <label htmlFor="rating">Rating</label>
                <select onChange={e => setRating(Number(e.target.value))} id="rating" value={rating}>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <input onChange={e => setComment(e.target.value)} type="submit" value="Submit" />
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
