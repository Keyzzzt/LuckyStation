import { FC, FormEvent, useEffect, useState } from 'react'
import styles from './OrderPage.module.scss'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { createOrderThunk } from '../../../03_Reducers/order/orderCreateReducer'
import { actions } from '../../../03_Reducers/order/orderCreateReducer'
import { CheckoutSteps } from '../../02_Chunks/CheckoutSteps/CheckoutSteps'
import { Button } from '../../02_Chunks/Button/Button'
import { CustomInput } from '../../02_Chunks/CustomInput/CustomInput'
import { isEmail } from '../../../04_Utils/utils'

export const OrderPage: FC = () => {
  const { userInfo } = useTypedSelector(state => state.userInfo)
  const { cart } = useTypedSelector(state => state)
  const { order, fail } = useTypedSelector(state => state.orderCreate)
  const [inputError, setInputError] = useState(false)

  const [continueAsGuest, setContinueAsGuest] = useState(false)

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
    dispatch(createOrderThunk(order))
  }

  // Возвращаем значения из полей, важно дать инициализационные значения, чтобы не было ошибки при проверке, когда пользователь не ввел данные
  const formData = {
    email: '',
    name: '',
    lastName: '',
  }
  const returnValue = (key: 'email' | 'name' | 'lastName', value: string) => {
    formData[key] = value
    console.log(formData)
  }
  // При submit нужно проверить валидность данных

  const submitHandler = (e: FormEvent<HTMLFormElement>, formData: any) => {
    e.preventDefault()
    console.log(formData)
    if (isEmail(formData.email) && formData.name.length >= 2 && formData.lastName.length >= 2) {
      setInputError(false)
    } else {
      setInputError(true)
      return
    }

    alert('OK')
  }

  useEffect(() => {
    if (order) {
      history.push(`/order/${order}`)
      dispatch(actions.reset())
    }
  }, [history, order, dispatch])

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
          <form onSubmit={e => submitHandler(e, formData)} className={styles.contactInfo}>
            <CustomInput
              returnValue={returnValue}
              setInputError={setInputError}
              type="text"
              placeholder="Email"
              name="email"
              inputError={inputError}
            />

            <div>
              <input className={styles.checkBox} type="checkbox" id="signUpForNewsletter" />
              <label htmlFor="signUpForNewsletter">Email me with news and offers</label>
            </div>
            <div className={styles.name}>
              <CustomInput
                returnValue={returnValue}
                setInputError={setInputError}
                type="text"
                placeholder="First name"
                name="name"
                inputError={inputError}
              />
              <CustomInput
                returnValue={returnValue}
                setInputError={setInputError}
                type="text"
                placeholder="Last name"
                name="lastName"
                inputError={inputError}
              />
            </div>
            <div>Shipping address</div>
            <div>
              <input type="text" placeholder="Country" />
              <input type="text" placeholder="Address" />
            </div>
            <div>
              <input type="text" placeholder="Apartment, suite, etc. (optional)" />
            </div>
            <div>
              <input type="text" placeholder="Postal code" />
              <input type="text" placeholder="City" />
            </div>
            <div>
              <input type="text" placeholder="Phone" />
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
      <div className={styles.orderRight}></div>
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
