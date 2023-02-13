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
 * ! TODO добавить header
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

import React, { FC, FormEvent, useEffect, useRef, useState } from 'react'
import s from './shippingPage.module.scss'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { createOrderThunk } from '../../../03_Reducers/order/orderCreateReducer'
import { CheckoutSteps } from '../../02_Chunks/CheckoutSteps/CheckoutSteps'
import { isEmail, toLocal } from '../../../04_Utils/utils'
import { saveContactInfoThunk } from '../../../03_Reducers/cart/cartReducer'
import { API } from '../../../API'
import { getRefValue } from '../../../04_Utils/getRefValue'
import { useWindowSize } from '../../../04_Utils/hooks'
import { useNavigate } from 'react-router-dom'
import { CustomInput } from '../../02_Chunks/CustomInput/CustomInput'

export const ShippingPage: FC = () => {
  const { userInfo } = useTypedSelector(state => state.userInfo)
  const { shippingAddress } = useTypedSelector(state => state.cart)
  const { cart } = useTypedSelector(state => state)
  // Here orderId and orderSuccess works together to avoid redirect if order once has been created,
  // we simply set orderSuccess to false before we redirect to payment, and so we easily can return.
  const { orderId } = useTypedSelector(state => state.orderCreate)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const { minPriceForFreeShipping, freeShippingMessage, taxRate } = useTypedSelector(state => state.appConfig.appConfig)
  const contentRef = useRef<HTMLDivElement>(null)
  const [subscribe, setSetSubscribe] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [height, setHeight] = useState<string | number>(0)
  const size = useWindowSize()
  const [inputError, setInputError] = useState(false)

  const [continueAsGuest, setContinueAsGuest] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
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
    return {
      email,
      orderItems,
      shippingAddress: cart.shippingAddress,
      paymentMethod: 'not specified',
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    }
  }

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    // Пытается создать заказ без телефона, плюс формат телефона проверить
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
      setHeight(contentEl.scrollHeight)
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

  // If window
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name)
      setEmail(userInfo.email)
    }
  }, [userInfo])

  // If order created and flag is true then redirect to next step
  useEffect(() => {
    if (orderId && orderSuccess) {
      setOrderSuccess(false)
      navigate(`/payment/${orderId}`)
    }
  }, [orderId, navigate, orderSuccess])

  return (
    <main className='stationSectionMain'>
      <div className={`stationContainer ${s.container}`}>
        <div onClick={() => setIsOpen(prev => !prev)} className={s.accordionHeader}>
          <div className={s.accordionTitle}>
            <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'}`}/>
            <span>{isOpen ? 'Hide' : 'Show'} order summary</span>
          </div>
          <div className={s.price}>{cart.itemsPrice.toLocaleString('en', toLocal)}</div>
        </div>
        <div className={s.orderSummary} style={{ height }}>
          <div className={s.orderSummaryWrapper} ref={contentRef}>
            {cart?.cartItems.length === 0 ? (
              <div>Cart is empty</div>
            ) : (
              cart.cartItems.map(item => (
                <div key={item._id} className={s.orderItem}>
                  <div className={s.orderItemImage}>
                    <img src={item.images[0].imageSrc} alt={item.images[0].imageAlt}/>
                  </div>
                  <div className={s.itemName}>{item.name}</div>
                  <div>x {item.qty}</div>
                  <div className={s.itemPrice}>{item.price.toLocaleString('en', toLocal)}</div>
                </div>
              ))
            )}
            <div className={s.discount}>
              <input type="text" className={`stationInput ${s.discountCode}`} placeholder="Discount code"/>
              <input type='button' className='stationSubmitBtn' value='Apply'/>
            </div>

            <div className={s.subTotalPrice}>
              <div>Subtotal</div>
              <div>Incl. {cart.taxPrice.toLocaleString('en', toLocal)} in taxes</div>
              <p>{cart.itemsPrice.toLocaleString('en', toLocal)}</p>
            </div>
            <div className={s.shippingPrice}>
              <div>Shipping</div>
              <div>{cart.itemsPrice > minPriceForFreeShipping ? freeShippingMessage : 'Calculated at next step'}</div>
            </div>
          </div>
        </div>
        <div className={s.collectData}>
          <div className={s.collectDataWrapper}>
            <CheckoutSteps step1 step2/>
            {!userInfo && !continueAsGuest ? (
              <div className={s.askForLogin}>
                <input type='button' className='stationSubmitBtn' value='Continue as guest'
                       onClick={() => setContinueAsGuest(true)}/>
                <input type='button' className='stationSubmitBtn'
                       onClick={() => navigate('/signin?redirect=shipping')} value='Login'/>
              </div>
            ) : null}
            <form onSubmit={submitHandler} className={s.form}>
              <div className={s.contacts}>
                <div className={s.customerDataTitle}>Contacts</div>
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
                <CustomInput
                  value={phone}
                  returnValue={setPhone}
                  setInputError={setInputError}
                  inputError={inputError}
                  type="text"
                  placeholder="Phone"
                  name="phone"
                />
                <CustomInput
                  value={email}
                  returnValue={setEmail}
                  setInputError={setInputError}
                  inputError={inputError}
                  type="text"
                  placeholder="Email"
                  name="email"
                />
              </div>
              <div className={s.customerDataTitle}>Shipping address</div>
              <div className={s.address}>
                <CustomInput
                  value={address}
                  returnValue={setAddress}
                  setInputError={setInputError}
                  inputError={inputError}
                  type="text"
                  placeholder="Address"
                  name="address"
                />
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
                  value={postalCode}
                  returnValue={setPostalCode}
                  setInputError={setInputError}
                  inputError={inputError}
                  type="text"
                  placeholder="Postal code"
                  name="postal code"
                />
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
                  value={apartment}
                  returnValue={setApartment}
                  setInputError={setInputError}
                  inputError={inputError}
                  type="text"
                  placeholder="Apartment, suite, etc. (optional)"
                  name="apartment"
                />
              </div>
              <div className={s.subscribe}>
                <input
                  onChange={() => setSetSubscribe(prev => !prev)}
                  className={s.checkBox}
                  type="checkbox"
                  id="signUpForNewsletter"
                />
                <label htmlFor="signUpForNewsletter">Email me with news and offers</label>
              </div>
              <div className={s.formSubmitButtons}>

                <input className='stationSubmitBtn' type="submit"/>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}