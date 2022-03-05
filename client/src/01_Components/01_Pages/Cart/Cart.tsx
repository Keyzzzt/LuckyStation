import { FC, useEffect, useState } from 'react'
import styles from './Cart.module.scss'
import { useDispatch } from 'react-redux'
import { useLocation, useParams } from 'react-router'
import { Link, useHistory } from 'react-router-dom'
import { addToCartThunk, removeFromCartThunk } from '../../../03_Reducers/cart/cartReducer'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { getRandom } from '../../../04_Utils/utils'
import { Button } from '../../02_Chunks/Button/Button'
import { Fail, Success } from '../../02_Chunks/SuccessAndFail/SuccessAndFail'

export const Cart: FC = () => {
  const { productId } = useParams<{ productId: string }>()
  const { search } = useLocation()
  const history = useHistory()
  const dispatch = useDispatch()
  const { cartItems } = useTypedSelector(state => state.cart)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)

  const qty = search ? Number(search.split('=')[1]) : 1

  const removeFromCartHandler = (productId: string) => {
    dispatch(removeFromCartThunk(productId))
  }

  const handleQuantity = (productId: string, quantity: number, countInStock: number, action: string) => {
    if (action === 'add') {
      quantity += 1
      quantity = quantity > countInStock ? countInStock : quantity
      dispatch(addToCartThunk(productId, quantity))
    } else {
      quantity -= 1
      quantity = quantity < 0 ? 0 : quantity
      dispatch(addToCartThunk(productId, quantity))
    }
  }
  const checkoutHandler = () => {
    if (!acceptedTerms) {
      if (window.confirm('Click OK to accept terms and conditions')) {
        setAcceptedTerms(true)
        return
      }
    }
    history.push('/placeorder')
  }
  const shippingMessage =
    totalPrice > 1000
      ? 'You are eligible for free shipping!'
      : `Spend € ${1000 - totalPrice} more and get free shipping!`

  useEffect(() => {
    if (productId) {
      dispatch(addToCartThunk(productId, qty))
    }
  }, [dispatch, productId, qty])

  useEffect(() => {
    history.push('/cart')
  }, [])
  useEffect(() => {
    setTotalPrice(prev => cartItems.reduce((acc, item) => acc + item.price! * item.qty!, 0))
  }, [cartItems])

  return (
    <div className={styles.container}>
      {cartItems.length === 0 ? (
        <div className={styles.emptyCart}>
          <div className={styles.emptyCartHeader}>YOUR CART IS EMPTY</div>
          <div className={styles.emptyCartText}>Spend €1000 more and get free shipping!</div>
          <Button path="/" colorTheme="light">
            SHOP OUR PRODUCTS
          </Button>
        </div>
      ) : (
        <>
          <div className={styles.cart}>
            <div className={styles.cartHeader}>CART</div>
            <div className={styles.cartDeliveryMessage}>{shippingMessage}</div>
            <div key={getRandom()} className={styles.productList}>
              <div className={styles.productListHeader}>
                <div className={styles.headerProduct}>PRODUCT</div>
                <div className={styles.headerQuantity}>QUANTITY</div>
                <div className={styles.headerTotal}>PRICE</div>
              </div>
              {cartItems.map((item, i) => (
                <>
                  <div className={styles.productItem}>
                    <div className={styles.productName}>
                      <Link to={`/product/${item._id}`}>
                        <div className={styles.productNameWrapper}>
                          <img src={item.images[0].imageSrc} alt="" />
                          <div className={styles.productNameTitle}>{item.name}</div>
                        </div>
                      </Link>
                    </div>
                    <div className={styles.productQuantity}>
                      {/* <select
                        value={item.qty}
                        onChange={e => dispatch(addToCartThunk(item._id, Number(e.target.value)))}
                      >
                        {[...Array(item.countInStock).keys()].map(n => (
                          <option key={getRandom()} value={n + 1}>
                            {n + 1}
                          </option>
                        ))}
                      </select> */}
                      <div className={styles.productQuantitySelect}>
                        <div
                          onClick={() => handleQuantity(item._id, item.qty!, +item.countInStock, 'add')}
                          className={styles.plus}
                        >
                          <i className="fa-solid fa-plus" />
                        </div>
                        <div>{item.qty}</div>
                        <div
                          onClick={() => handleQuantity(item._id, item.qty!, +item.countInStock, 'remove')}
                          className={styles.minus}
                        >
                          <i className="fa-solid fa-minus" />
                        </div>
                      </div>

                      <div className={styles.removeFromCart} onClick={() => removeFromCartHandler(item._id)}>
                        Remove
                      </div>
                    </div>
                    <div className={styles.productPrice}>&euro; {item.price}</div>
                  </div>
                </>
              ))}
            </div>
          </div>
          <div className={styles.checkout}>
            <div className={styles.checkoutPrice}>TOTAL: &euro; {totalPrice}</div>
            <div className={styles.checkoutText}>Shipping &#38; taxes calculated at checkout</div>
            <div className={styles.checkoutTerms}>
              {/* <input type="checkbox" checked={acceptedTerms} onClick={() => setAcceptedTerms(!acceptedTerms)} /> */}
              <div onClick={() => setAcceptedTerms(!acceptedTerms)}>{acceptedTerms ? <Success /> : <Fail />}</div>
              <Link to="/terms">
                &nbsp;I accept <span>terms &#38; conditions</span>
              </Link>
            </div>
            <button onClick={checkoutHandler} disabled={totalPrice === 0}>
              CHECKOUT SECURELY
            </button>
          </div>
        </>
      )}
    </div>
  )
}
