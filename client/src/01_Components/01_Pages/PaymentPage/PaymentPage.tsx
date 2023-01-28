import s from './paymentPage.module.scss'
import { FC, useEffect, useState } from 'react'
import { PayPalButton } from 'react-paypal-button-v2'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { Message } from '../../02_Chunks/Message/Message'
import Loader from '../../02_Chunks/Loader/Loader'
import { orderInfoThunk } from '../../../03_Reducers/order/orderInfoReducer'
import $api from '../../../04_Utils/axiosSetup'
import { payOrderThunk } from '../../../03_Reducers/order/orderPayReducer'
import { actions } from '../../../03_Reducers/order/orderPayReducer'

export const PaymentPage: FC = () => {
  const { orderInfo, fail } = useTypedSelector(state => state.orderInfo)
  const { success: successPay, loading: loadingPay } = useTypedSelector(state => state.orderPay)
  const [sdkReady, setSdkReady] = useState(false)
  const dispatch = useDispatch()
  const params = useParams<{ orderId: string }>()
  const successPaymentHandler = (paymentResult: any) => {
    if (!orderInfo) {
      return
    }
    dispatch(payOrderThunk(orderInfo._id, paymentResult))
  }

  // Load PayPal button
  useEffect(() => {
    const addPayPalScript = async () => {
      const { data } = await $api.get(`/config/paypal`)
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
      script.onload = () => {
        setSdkReady(true)
      }
      document.body.appendChild(script)
    }
    if (successPay) {
      dispatch(actions.reset())
    } else if (orderInfo && !orderInfo.isPaid) {
      if (!window.paypal) {
        addPayPalScript()
      } else {
        setSdkReady(true)
      }
    }
  }, [orderInfo?.isPaid, successPay, orderInfo])

  // Fetch order
  useEffect(() => {
    if(params.orderId)
    dispatch(orderInfoThunk(params.orderId))
  }, [params.orderId])

  return (
    <main className={s.container}>
      {fail && <Message message={fail} type="fail" />}
      {!orderInfo ? (
        <Loader />
      ) : (
        <>
          <div>
            <h1 style={{ fontSize: '100px' }}>TODO</h1>
            <div>Order Items</div>
            {orderInfo.orderItems.map(item => (
              <div key={item.id}>
                <div>Name: {item.name}</div>
                <div>
                  <img src={item.image} alt="Product" />
                </div>
                <div>Quantity: {item.quantity}</div>
                <div>Product price: {item.price}</div>
              </div>
            ))}
          </div>
          <div>
            <div>Order Summary</div>
            <div>Tax price: {orderInfo.taxPrice}</div>
            <div>Shipping price: {orderInfo.shippingPrice}</div>
            <div>Total price: {orderInfo.totalPrice}</div>
            <div>
              Shipping address:{' '}
              {`${orderInfo.shippingAddress.address}, ${orderInfo.shippingAddress.postalCode}, ${orderInfo.shippingAddress.city}, ${orderInfo.shippingAddress.country}`}
            </div>
            <div>Created at: {orderInfo.createdAt}</div>
            <div>{orderInfo.isPaid ? 'Paid' : 'Not paid'}</div>
            <div>{orderInfo.isDelivered ? 'Delivered' : 'Not delivered'}</div>
            {orderInfo.paidAt && <div>Paid at: {orderInfo.paidAt}</div>}
            <div>Payment method: {orderInfo.paymentMethod}</div>
          </div>
          {/* {!orderInfo.isPaid && <button onClick={paymentHandler}>Pay Order</button>} */}
          {!orderInfo.isPaid && (
            <div>
              {loadingPay && <Loader />}
              {!sdkReady ? (
                <Loader />
              ) : (
                <PayPalButton amount={orderInfo.totalPrice} onSuccess={successPaymentHandler} />
              )}
            </div>
          )}
        </>
      )}
    </main>
  )
}
