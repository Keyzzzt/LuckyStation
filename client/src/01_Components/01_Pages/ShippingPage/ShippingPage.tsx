/**
 * ? TODO - create form that has name,lastName,address,city,postalCode,apartment,country,phone input fields
 * ? TODO - if user is logged in, all info should be filled in automatically from userInfo
 * ? TODO - remove product from cart
 * ? TODO - accept terms before proceed product
 * ? TODO -
 * ! FIXME subscribeThunk
 * ! FIXME saveContactInfoThunk синхронная функция, нет необходимости ее диспачить g
 * ! FIXME сообщение о бесплатной доставке должно хранится на серваке
 * ! FIXME Реализовать функционал с кодом скидки
 * ! FIXME Налоговая ставка должна хранится на серваке
 * ! FIXME сумма после которой идет бесплатная доставка должна хранится на серваке
 *
 * * Принцип аккардиона на этой странице.
 * * Изначальная высота orderSummary 0, но если окно больше чем 1200 то дается значение auto
 * * У нас есть шапка аккордиона, она спрятана на большом экране.
 * * Если экран меньше чем 1200 flex-direction: row, и шапка аккардиона появляется.
 * * Но так как изначально значение высоты 0, то orderSummary будет спрятан. И уже при клике меняем isOpen,
 * *  и меняем высоту на фактическую высоту orderSummary через useRef
 * * Однако данная конструкция не будет работать так же если мы с большого экрана будем вручную менять размер экрана,
 * *  при уменьшении появится шапка аккордиона и orderSummary будет открыт, так как ранее в useEffect мы меняли значение.
 */

import { FC, FormEvent, useEffect, useRef, useState } from 'react'
import s from './shippingPage.module.scss'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { createOrderThunk } from '../../../03_Reducers/order/orderCreateReducer'
import { CheckoutSteps } from '../../02_Chunks/CheckoutSteps/CheckoutSteps'
import { CustomInput } from '../../02_Chunks/CustomInput/CustomInput'
import { isEmail } from '../../../04_Utils/utils'
import { saveContactInfoThunk } from '../../../03_Reducers/cart/cartReducer'
import { subscribeThunk } from '../../../03_Reducers/user/userInfoReducer'
import { API } from '../../../API'
import { getRefValue } from '../../../04_Utils/getRefValue'
import { useWindowSize } from '../../../04_Utils/hooks'
import { useNavigate } from 'react-router-dom'

export const ShippingPage: FC = () => {
  const { userInfo } = useTypedSelector(state => state.userInfo)
  const { shippingAddress } = useTypedSelector(state => state.cart)
  const { cart } = useTypedSelector(state => state)

  // Here orderId and orderSuccess works together to avoid redirect if order once has been created,
  // we simply set orderSuccess to false before we redirect to payment, and so we easily can return.
  const { orderId } = useTypedSelector(state => state.orderCreate)
  const [orderSuccess, setOrderSuccess] = useState(false)

  const { minPriceForFreeShipping, freeShippingMessage, taxRate } = useTypedSelector(state => state.appConfig.config!)

  const contentRef = useRef<HTMLDivElement>(null)

  const [subscribe, setSetSubscribe] = useState(false)

  const [isOpen, setIsOpen] = useState(false)
  const [height, setHeight] = useState<string | number>(0)
  const size = useWindowSize()

  const [inputError, setInputError] = useState(false)

  const [continueAsGuest, setContinueAsGuest] = useState(false)
  const [email, setEmail] = useState('2342@235454.com')
  const [name, setName] = useState(shippingAddress.name)
  const [lastName, setLastName] = useState(shippingAddress.lastName)
  const [country, setCountry] = useState(shippingAddress.country)
  const [address, setAddress] = useState(shippingAddress.address)
  const [apartment, setApartment] = useState(shippingAddress.apartment)
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
  const [city, setCity] = useState(shippingAddress.city)
  const [phone, setPhone] = useState(shippingAddress.phone)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  cart.itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty!, 0)
  cart.shippingPrice = +cart.itemsPrice > minPriceForFreeShipping ? 0 : 25
  cart.taxPrice = Number((taxRate * +cart.itemsPrice).toFixed(2))
  cart.totalPrice = Number(cart.itemsPrice + cart.shippingPrice)

  const createOrder = () => {
    const orderItems = cart.cartItems.map(item => ({
      name: item.name,
      quantity: item.qty,
      images: item.images,
      price: item.price,
      product: item._id,
    }))
    const order = {
      email,
      orderItems,
      shippingAddress: cart.shippingAddress,
      paymentMethod: 'not specified',
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    }
    return order
  }

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isEmail(email) && name.length >= 2 && lastName.length >= 2) {
      setInputError(false)
    } else {
      setInputError(true)
      return
    }
    const contactInfo = {
      name,
      lastName,
      address,
      city,
      postalCode,
      apartment,
      country,
      phone,
    }
    dispatch(saveContactInfoThunk(contactInfo))
    const order = createOrder()
    setOrderSuccess(true)

    if (window.confirm('Save order and proceed to payment?')) {
      if (subscribe) {
        API.user.subscribe(email)
      }
      dispatch(createOrderThunk({ ...order }))
    }
  }

  useEffect(() => {
    if (isOpen) {
      const contentEl = getRefValue(contentRef)
      setHeight(contentEl.scrollHeight - 30)
    } else {
      setHeight(0)
    }
  }, [isOpen])

  // If window
  useEffect(() => {
    if (size.width > 1200) {
      setHeight('auto')
      setIsOpen(false)
    }
  }, [size])

  // If order created and flag is true then redirect to next step
  useEffect(() => {
    if (orderId && orderSuccess) {
      setOrderSuccess(false)
      navigate(`/payment/${orderId}`)
    }
  }, [orderId, navigate, orderSuccess])

  return (
    <div className={s.container}>
      <div onClick={() => setIsOpen(prev => !prev)} className={s.orderSummaryAccordion}>
        <div className={s.accordionTitle}>
          <i className="fa-brands fa-opencart" />
          <div>{isOpen ? 'Hide' : 'Show'} order summary</div>
          <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'}`} />
        </div>
        <div className={s.accordionPrice}>
          <span className={s.price}>&euro;{cart.itemsPrice}</span>
        </div>
      </div>
      <div className={s.orderSummary} style={{ height }}>
        <div className={s.rightWrapper} ref={contentRef}>
          <div className={s.cartItems}>
            {cart?.cartItems.length === 0 ? (
              <div>Cart is empty</div>
            ) : (
              cart.cartItems.map((item, i) => (
                <div className={s.item}>
                  <div className={s.itemImage}>
                    <img src={item.images[0].imageSrc} alt={item.images[0].imageAlt} />
                    <div className={s.itemQty}>{item.qty}</div>
                  </div>
                  <div className={s.itemName}>{item.name}</div>
                  <div className={s.itemPrice}>&euro;{item.price}</div>
                </div>
              ))
            )}
          </div>
          <div className={s.discount}>
            <input type="text" className={s.discountInput} placeholder="Discount code" />
            <button className={s.btn}>Apply</button>
          </div>
          <div className={s.subTotal}>
            <div className={s.subTotalPrice}>
              <div>Subtotal</div>
              <div className={s.price}>&euro;{cart.itemsPrice}</div>
            </div>
            <div className={s.shippingPrice}>
              <div>Shipping</div>
              <div>{cart.itemsPrice > minPriceForFreeShipping ? freeShippingMessage : 'Calculated at next step'}</div>
            </div>
          </div>
          <div className={s.totalPrice}>
            <div className={s.totalPriceLeft}>
              <div>Total</div>
              <div>Including &euro;{cart.taxPrice} in taxes</div>
            </div>
            <div className={s.totalPriceRight}>
              <span>EUR&nbsp;&nbsp;</span>
              <span className={s.price}>&euro;{cart.itemsPrice}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={s.shipping}>
        <div className={s.leftWrapper}>
          <CheckoutSteps step1 step2 />
          {!userInfo && !continueAsGuest && (
            <div className={s.askForLogin}>
              <div>
                <button className={s.btn} onClick={() => navigate('/login?redirect=placeorder')}>
                  Login
                </button>
              </div>
              <div>OR</div>
              <div>
                <button className={s.btn} onClick={() => setContinueAsGuest(true)}>
                  Continue as guest
                </button>
              </div>
            </div>
          )}
          <form onSubmit={submitHandler} className={s.contactInfo}>
            <div className={s.name}>
              <CustomInput
                value={name}
                returnValue={setName}
                setInputError={setInputError}
                inputError={inputError}
                type="text"
                placeholder="Name"
                name="name"
              />
              <CustomInput
                value={lastName}
                returnValue={setLastName}
                setInputError={setInputError}
                inputError={inputError}
                type="text"
                placeholder="Last name"
                name="lastName"
              />
            </div>
            <div className={s.shippingAddress}>Shipping address</div>
            <div>
              <CustomInput
                value={country}
                returnValue={setCountry}
                setInputError={setInputError}
                inputError={inputError}
                type="text"
                placeholder="Country"
                name="country"
              />
              <CustomInput
                value={address}
                returnValue={setAddress}
                setInputError={setInputError}
                inputError={inputError}
                type="text"
                placeholder="Address"
                name="address"
              />
            </div>
            <div>
              <CustomInput
                value={apartment}
                returnValue={setApartment}
                setInputError={setInputError}
                inputError={inputError}
                type="text"
                placeholder="Apartment, suite, etc. (optional)"
                name="apartment"
              />
              <CustomInput
                value={postalCode}
                returnValue={setPostalCode}
                setInputError={setInputError}
                inputError={inputError}
                type="text"
                placeholder="Postal code"
                name="postal code"
              />
            </div>
            <div className={s.cityAndPhone}>
              <CustomInput
                value={city}
                returnValue={setCity}
                setInputError={setInputError}
                inputError={inputError}
                type="text"
                placeholder="City"
                name="city"
              />
              <CustomInput
                value={phone}
                returnValue={setPhone}
                setInputError={setInputError}
                inputError={inputError}
                type="text"
                placeholder="Phone"
                name="phone"
              />
            </div>
            <CustomInput
              value={email}
              returnValue={setEmail}
              setInputError={setInputError}
              inputError={inputError}
              type="text"
              placeholder="Email"
              name="email"
            />

            <div className={s.subscribe}>
              <input
                onChange={() => setSetSubscribe(prev => !prev)}
                className={s.checkBox}
                type="checkbox"
                id="signUpForNewsletter"
              />
              <label htmlFor="signUpForNewsletter">Email me with news and offers</label>
            </div>
            <div>
              <input className={`${s.btn} ${s.btnSubmit}`} type="submit" />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
