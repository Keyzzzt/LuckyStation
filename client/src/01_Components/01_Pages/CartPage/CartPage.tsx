import React, { FC, useEffect, useState } from 'react'
import s from './cartPage.module.scss'
import { useDispatch } from 'react-redux'
import { useLocation, useParams } from 'react-router'
import { Link, useNavigate } from 'react-router-dom'
import { addToCartThunk, removeFromCartThunk } from '../../../03_Reducers/cart/cartReducer'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { Button } from '../../02_Chunks/Button/Button'
import { Fail, Success } from '../../02_Chunks/SuccessAndFail/SuccessAndFail'
import { CheckoutSteps } from '../../02_Chunks/CheckoutSteps/CheckoutSteps'

export const CartPage: FC = () => {
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)

  const { minPriceForFreeShipping, freeShippingMessage } = useTypedSelector(state => state.appConfig.config!)
  const { cartItems } = useTypedSelector(state => state.cart)

  const { productId } = useParams<{ productId: string }>()
  const { search } = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

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
        navigate('/shipping')
        return
      }
    }
    navigate('/shipping')
  }
  const shippingMessage =
    totalPrice > minPriceForFreeShipping
      ? freeShippingMessage
      : `Spend € ${minPriceForFreeShipping - totalPrice} more and get free shipping!`

  useEffect(() => {
    if (productId) {
      dispatch(addToCartThunk(productId, qty))
    }
  }, [dispatch, productId, qty])

  useEffect(() => {
    navigate('/cart')
  }, [])
  useEffect(() => {
    setTotalPrice(prev => cartItems.reduce((acc, item) => acc + item.price! * item.qty!, 0))
  }, [cartItems])

  return (
    <main className='stationContainer'>
      {cartItems.length === 0 ? (
        <div className={s.emptyCart}>
          <div className={s.emptyCartHeader}>YOUR CART IS EMPTY</div>
          <div className={s.emptyCartText}>Spend €1000 more and get free shipping!</div>
          <Button path="/" colorTheme="light">
            SHOP OUR PRODUCTS
          </Button>
        </div>
      ) : (
        <>
          <div className={s.cart}>
            <h2 className={s.cartHeader}>CART</h2>
            <div className={s.cartDeliveryMessage}>{shippingMessage}</div>
            <CheckoutSteps step1 />
            <div className={s.productList}>
              <div className={s.productListHeader}>
                <div className={s.headerProduct}>PRODUCT</div>
                <div className={s.headerQuantity}>QUANTITY</div>
                <div className={s.headerTotal}>PRICE</div>
              </div>
              {cartItems.map(item => (
                <div className={s.productItem} key={item._id}>
                  <div className={s.productName}>
                    <Link to={`/product/${item._id}`}>
                      <div className={s.productNameWrapper}>
                        <img src={item.images[0].imageSrc} alt=""/>
                        <div className={s.productNameTitle}>{item.name}</div>
                      </div>
                    </Link>
                  </div>
                  <div className={s.productQuantity}>
                    {/* <select
                        value={item.qty}
                        onChange={e => dispatch(addToCartThunk(item._id, Number(e.target.value)))}
                      >
                        {[...Array(item.countInStock).keys()].map((n, i) => (
                          <option key={i} value={n + 1}>
                            {n + 1}
                          </option>
                        ))}
                      </select> */}
                    <div className={s.productQuantitySelect}>
                      <div
                        onClick={() => handleQuantity(item._id, item.qty!, +item.countInStock, 'add')}
                        className={s.plus}
                      >
                        <i className="fa-solid fa-plus"/>
                      </div>
                      <div>{item.qty}</div>
                      <div
                        onClick={() => handleQuantity(item._id, item.qty!, +item.countInStock, 'remove')}
                        className={s.minus}
                      >
                        <i className="fa-solid fa-minus"/>
                      </div>
                    </div>

                    <div className={s.removeFromCart} onClick={() => removeFromCartHandler(item._id)}>
                      Remove
                    </div>
                  </div>
                  <div className={s.productPrice}>&euro; {item.price}</div>
                </div>
              ))}
            </div>
          </div>
          <div className={s.checkout}>
            <div className={s.checkoutPrice}>TOTAL: &euro; {totalPrice}</div>
            <div className={s.checkoutText}>Shipping &#38; taxes calculated at checkout</div>
            <div className={s.checkoutTerms}>
              {/* <input type="checkbox" checked={acceptedTerms} onClick={() => setAcceptedTerms(!acceptedTerms)} /> */}
              <div onClick={() => setAcceptedTerms(!acceptedTerms)}>{acceptedTerms ? <Success/> : <Fail/>}</div>
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
    </main>
  )
}
