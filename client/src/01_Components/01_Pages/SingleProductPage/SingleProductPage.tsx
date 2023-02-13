import { FC, useEffect, useState } from 'react'
import s from './singleProductPage.module.scss'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import Loader from '../../02_Chunks/Loader/Loader'
import { SingleProductPageSlider } from '../../02_Chunks/SingleProductPageSlider/SingleProductPageSlider'
import { Accordion } from '../../02_Chunks/Accordion/Accordion'

export const ProductScreen: FC = () => {
  const { productInfo } = useTypedSelector(state => state.productInfo)
  const navigate = useNavigate()
  const { productId } = useParams<{ productId: string }>()
  const [qty, setQty] = useState(1)
  const [accordionData, setAccordionData] = useState<any>([])

  const addToCartHandler = () => {
    navigate(`/cart/${productId}?qty=${qty}`)
  }

  // const submitHandler = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   dispatch(productReviewThunk(productId, { rating, comment }))
  // }

  useEffect(() => {
    if (productInfo) {
      setAccordionData([
        {
          title: 'details',
          content: [
            {
              title: 'Includes',
              value: productInfo.includes,
            },
            {
              title: 'Maximum load capacity',
              value: productInfo.maximumLoadCapacity,
            },
            {
              title: 'Size',
              value: productInfo.size,
            },
            {
              title: 'Weight',
              value: productInfo.weight,
            },
            {
              title: 'Maximum load capacity',
              value: productInfo.maximumLoadCapacity,
            },
            {
              title: 'Care',
              value: productInfo.careInstructions,
            },
            {
              title: 'Materials',
              value: productInfo.materials,
            },
            {
              title: 'Care',
              value: productInfo.colorsInText,
            },
          ],
        },
        {
          title: 'What should you know',
          content: [
            {
              title: 'Good to know',
              value: productInfo.whatShouldYouKnow,
            },
          ],
        },
        {
          title: 'Additional info',
          content: [
            {
              title: 'Quality',
              value: productInfo.quality,
            },
            {
              title: 'Additional info',
              value: productInfo.additionalInfo,
            },
          ],
        },
      ])
    }
  }, [productInfo])
  return (
    <main className='stationContainer'>
      {!productInfo ? (
        <Loader/>
      ) : (
        <div className={s.product}>
          <div className={s.productSlider}>
            <SingleProductPageSlider images={productInfo.images} isNew={productInfo.isNewProduct}/>
          </div>
          <div className={s.productInfo}>
            <h1 className={s.name}>{productInfo.name}</h1>

            <div className={s.description}>{productInfo.description}</div>
            <div>
              {productInfo.countInStock === 0 ? (
                <div className={s.buyPrice}>Out of stock</div>
              ) : (
                <div className={s.buyPrice}>
                  <input onClick={addToCartHandler} className='stationSubmitBtn' type="button"
                         value="Add to cart"/>
                </div>
              )}
              {/* <div>
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
              </div> */}
            </div>
            <div className={s.description}>{productInfo.description2}</div>
          </div>

          {/* <Button value={productInfo.rating} reviews={productInfo.numReviews} /> */}

          {/* {productInfo.reviews.length === 0 ? (
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
          )} */}
          {/* {!userInfo ? (
            <Link to="/login">Please login to create review</Link>
          ) : alreadyReviewed ? (
            <div>You have already reviewed this product with rating {alreadyReviewed.rating}</div>
          ) : (
            <form onSubmit={submitHandler} className={styles.reviewForm}>
              <input onChange={e => setComment(e.target.value)} type="text" value={comment} />
              <label htmlFor="rating">Button</label>
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
          )} */}
        </div>
      )}
      <Accordion items={accordionData}/>
    </main>
  )
}
