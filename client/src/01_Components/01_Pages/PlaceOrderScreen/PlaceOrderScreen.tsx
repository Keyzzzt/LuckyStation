import { FC, useEffect } from 'react'
import styles from './PlaceOrderScreen.module.scss'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { createOrderThunk } from '../../../03_Reducers/order/orderCreateReducer'
import { Message } from '../../02_Chunks/Message/Message'
import { actions } from '../../../03_Reducers/order/orderCreateReducer'
import { CheckoutSteps } from '../../02_Chunks/CheckoutSteps/CheckoutSteps'

export const PlaceOrderScreen: FC = () => {
  const { cart } = useTypedSelector(state => state)
  const { order, fail } = useTypedSelector(state => state.orderCreate)
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

  useEffect(() => {
    if (order) {
      history.push(`/order/${order}`)
      dispatch(actions.reset())
    }
  }, [history, order, dispatch])

  return (
    <div className={styles.container}>
      <CheckoutSteps step1 step2 step3 step4 />
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
      </div>
    </div>
  )
}
