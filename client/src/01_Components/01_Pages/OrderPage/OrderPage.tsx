import { FC, FormEvent, useEffect, useState } from 'react'
import styles from './OrderPage.module.scss'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { createOrderThunk } from '../../../03_Reducers/order/orderCreateReducer'
import { CheckoutSteps } from '../../02_Chunks/CheckoutSteps/CheckoutSteps'
import { Button } from '../../02_Chunks/Button/Button'
import { CustomInput } from '../../02_Chunks/CustomInput/CustomInput'
import { isEmail } from '../../../04_Utils/utils'
import { saveContactInfoThunk } from '../../../03_Reducers/cart/cartReducer'

export const OrderPage: FC = () => {
  const { userInfo } = useTypedSelector(state => state.userInfo)
  const { shippingAddress } = useTypedSelector(state => state.cart)
  const { cart } = useTypedSelector(state => state)

  const [inputError, setInputError] = useState(false)
  const [continueAsGuest, setContinueAsGuest] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState(shippingAddress.name)
  const [lastName, setLastName] = useState(shippingAddress.lastName)
  const [country, setCountry] = useState(shippingAddress.country)
  const [address, setAddress] = useState(shippingAddress.address)
  const [apartment, setApartment] = useState(shippingAddress.apartment)
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
  const [city, setCity] = useState(shippingAddress.city)
  const [phone, setPhone] = useState(shippingAddress.phone)

  const dispatch = useDispatch()
  const history = useHistory()

  const addDecimals = (num: number) => {
    return +(Math.round(num * 100) / 100).toFixed(2)
  }
  cart.itemsPrice = addDecimals(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty!, 0))
  cart.shippingPrice = addDecimals(+cart.itemsPrice > 100 ? 0 : 25)
  cart.taxPrice = addDecimals(Number((0.15 * +cart.itemsPrice).toFixed(2)))
  cart.totalPrice = addDecimals(Number(cart.itemsPrice + cart.shippingPrice + cart.taxPrice))

  const createOrder = () => {
    const orderItems = cart.cartItems.map(item => ({
      name: item.name,
      quantity: item.qty,
      images: item.images,
      price: item.price,
      product: item._id,
    }))
    const order = {
      orderItems,
      shippingAddress: cart.shippingAddress,
      paymentMethod: cart.paymentMethod,
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
    // todo предпоказ заказа для подтверждения, если OK ...
    if (window.confirm('Save order and proceed to payment?')) {
      dispatch(createOrderThunk(order))
      history.push('/payment')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.orderLeft}>
        <div className={styles.leftWrapper}>
          <CheckoutSteps step1 step2 step3 step4 />
          {!userInfo && !continueAsGuest && (
            <div className={styles.askForLogin}>
              <div>
                <Button path="/login?redirect=placeorder" colorTheme="dark">
                  LOGIN
                </Button>
              </div>
              <div>OR</div>
              <div>
                <button onClick={() => setContinueAsGuest(true)}>Continue as guest</button>
              </div>
            </div>
          )}
          <form onSubmit={submitHandler} className={styles.contactInfo}>
            <CustomInput
              value={email}
              returnValue={setEmail}
              setInputError={setInputError}
              inputError={inputError}
              type="text"
              placeholder="Email"
              name="email"
            />
            <div>
              <input className={styles.checkBox} type="checkbox" id="signUpForNewsletter" />
              <label htmlFor="signUpForNewsletter">Email me with news and offers</label>
            </div>
            <div className={styles.name}>
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
            <div>Shipping address</div>
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
            <div className={styles.cityAndPhone}>
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

            <div>
              <label htmlFor="saveInfo">Save this information for next time</label>
              <input className={styles.checkBox} type="checkbox" id="saveInfo" />
            </div>
            <div>
              <input type="submit" />
            </div>
          </form>
        </div>
      </div>
      <div className={styles.orderRight}>// todo</div>
    </div>
  )
}

{
  /* <CheckoutSteps step1 step2 step3 step4 />
{fail && <Message message={fail} type="fail" />}
<div className={styles.summary}>
  <div className={styles.summaryItem}>
    <div>
      <strong>Shipping</strong>
    </div>
    <div>{cart.shippingAddress.address}</div>
    <div>{cart.shippingAddress.postalCode}</div>
    <div>{cart.shippingAddress.city}</div>
    <div>{cart.shippingAddress.country}</div>
  </div>
  <div className={styles.summaryItem}>
    <div>
      <strong>Payment</strong>
    </div>
    <div>{cart.paymentMethod}</div>
  </div>
  <div className={styles.summaryItem}>
    <div>
      <strong>Order Items</strong>
    </div>
    <div>
      {cart.cartItems.length > 0 &&
        cart.cartItems.map(item => (
          <div key={item._id}>
            <div>{item.name}</div>
            <div>
              <img src={item.images[0].imageSrc} alt="" />
            </div>
            <div>Quantity: {item.qty}</div>
            <div>Price: {item.qty! * item.price}</div>
          </div>
        ))}
      {cart.cartItems.length === 0 && <div>Your cart is empty</div>}
    </div>
  </div>
  <div className={styles.summaryItem}>
    <div>
      <strong>Order Summary</strong>
    </div>

    <div>Items: ${cart.itemsPrice}</div>
    <div>Shipping: ${cart.shippingPrice}</div>
    <div>Tax: ${cart.taxPrice}</div>
    <div>Total: ${cart.totalPrice}</div>
  </div>
  <button onClick={createOrder} disabled={cart.cartItems.length === 0}>
    Proceed
  </button>
</div> */
}
