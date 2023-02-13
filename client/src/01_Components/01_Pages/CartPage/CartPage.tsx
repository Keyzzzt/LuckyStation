import React, { FC, useEffect, useState } from 'react'
import s from './cartPage.module.scss'
import { useDispatch } from 'react-redux'
import { useLocation, useParams } from 'react-router'
import { Link, useNavigate } from 'react-router-dom'
import { addToCartThunk, removeFromCartThunk } from '../../../03_Reducers/cart/cartReducer'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { CheckoutSteps } from '../../02_Chunks/CheckoutSteps/CheckoutSteps'
import { toLocal } from '../../../04_Utils/utils'

export const CartPage: FC = () => {
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)

  const { minPriceForFreeShipping, freeShippingMessage } = useTypedSelector(state => state.appConfig.appConfig)
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
      quantity = quantity <= countInStock ? quantity : countInStock
      dispatch(addToCartThunk(productId, quantity))
    } else {
      quantity -= 1
      quantity = quantity < 0 ? 0 : quantity
      dispatch(addToCartThunk(productId, quantity))
    }
  }
  const checkoutHandler = () => {
    if (!acceptedTerms) {
      alert('Please accept terms and conditions')
        return
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
    <div className='stationSectionMain'>
      <main className={`stationContainer ${s.container}`}>
        {cartItems.length === 0 ? (
          <div className={s.emptyCart}>
            <div className={`stationSectionTitle ${s.emptyCartHeader}`}>Your cart is empty</div>
            <div className={`stationSectionSubtitle ${s.emptyCartText}`}>Spend €1000 more and get free shipping!</div>
            <Link className='stationSubmitBtn' to='/products'>Check our products</Link>
          </div>
        ) : (
          <div className={s.cart}>
            <h2 className='stationSectionTitle'>CART</h2>
            <div className='stationSectionSubtitle'>{shippingMessage}</div>
            <CheckoutSteps step1/>
            <div className={s.productList}>
              {cartItems.map(p => (
                <div className={s.productItem} key={p._id}>
                  <div className={s.top}>
                    <div className={s.product}>
                      <img className={s.image} src={p.images[0].imageSrc} alt=""/>
                    </div>
                    <div className={s.info}>
                      <div className={s.quantity}>
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
                            onClick={() => handleQuantity(p._id, p.qty!, +p.countInStock, 'add')}
                            className={s.plus}
                          >
                            <i className="fa-solid fa-plus"/>
                          </div>
                          <div>{p.qty}</div>
                          <div
                            onClick={() => handleQuantity(p._id, p.qty!, +p.countInStock, 'remove')}
                            className={s.minus}
                          >
                            <i className="fa-solid fa-minus"/>
                          </div>
                        </div>
                      </div>
                      <div className={s.prices}>{(p.price * p.qty!).toLocaleString('en', toLocal)}</div>
                      <div className={s.removeFromCart} onClick={() => removeFromCartHandler(p._id)}>Remove</div>
                    </div>
                  </div>
                  <div className={s.bottom}>
                    <Link className={s.name} to={`/product/${p._id}`}>{p.name}</Link>
                    <div className={s.prices}>{p.price.toLocaleString('en', toLocal)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className={s.checkout}>
              <div className={s.checkoutPrice}>TOTAL: &euro; {totalPrice}</div>
              <div className={s.checkoutText}>Shipping &#38; Taxes calculated at next step</div>
              <div className={s.checkoutText}>*Free shipping does not apply for all countries</div>
              <div>
                <input type="checkbox" onChange={() => setAcceptedTerms(!acceptedTerms)}/>
                <span> I accept <Link to="/terms">terms &#38; conditions</Link></span>
              </div>
              <div>
                <input className={`stationSubmitBtn ${s.checkoutBtn}`} type='button' onClick={checkoutHandler} disabled={totalPrice === 0} value='Checkout' />
              </div>
            </div>
          </div>

        )}
      </main>
    </div>
  )
}
