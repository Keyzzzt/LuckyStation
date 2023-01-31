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
import { toLocal } from '../../../04_Utils/utils'

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
    if (params.orderId)
      dispatch(orderInfoThunk(params.orderId))
  }, [params.orderId])


  const deliveryAddressString = `${orderInfo?.shippingAddress.address}, ${orderInfo?.shippingAddress.city}, ${orderInfo?.shippingAddress.postalCode}, ${orderInfo?.shippingAddress.country} `
  const dateCreated = orderInfo?.createdAt.split('T')[0]
  const timeCreate = orderInfo?.createdAt.split('T')[1].slice(0,8)

  return (
    <main className={`stationContainer ${s.container}`}>
      {fail && <Message message={fail} type="fail"/>}
      {!orderInfo ? (
        <Loader/>
      ) : (
        <>
          <div className={s.paypal}>
            <div className={s.left}>
              <div className={s.item}>
                <p className={s.itemTitle}>Payment method</p>
                <p>PayPal</p>
              </div>
              <div className={s.item}>
                <p className={s.itemTitle}>Amount</p>
                <p>{orderInfo.itemsPrice.toLocaleString('en', toLocal)}</p>
              </div>
              <div className={s.item}>
                <p className={s.itemTitle}>Shipping price</p>
                <p>{orderInfo.shippingPrice.toLocaleString('en', toLocal)}</p>
              </div>
              <div className={s.item}>
                <p className={s.itemTitle}>Total price</p>
                <p>{orderInfo.totalPrice.toLocaleString('en', toLocal)} incl. tax</p>
              </div>
              <div className={s.item}>
                <p className={s.itemTitle}>Delivery address</p>
                <span>{deliveryAddressString}</span>
              </div>
            </div>
            <div className={s.right}>
              <div className={s.item}>
                <p className={s.itemTitle}>Order ID</p>
                <p>{orderInfo._id}</p>
              </div>
              <div className={s.item}>
                <p className={s.itemTitle}>Created</p>
                <p>{dateCreated + ' / ' + timeCreate}</p>
              </div>
              <div className={s.item}>
                <p className={s.itemTitle}>Status</p>
                {orderInfo.isPaid ? <span className='success'>Paid</span> : <span className='danger'>Not paid</span>}
              </div>
              <div className={s.item}>
                <p className={s.itemTitle}>Contacts</p>
                <p>TODO</p>
              </div>
              <div className={s.item}>
                <p className={s.itemTitle}>Contacts</p>
                <p>TODO</p>
              </div>
            </div>
            <div className={s.paypalButtons}>
              {!orderInfo?.isPaid && (
                <div>
                  {loadingPay && <Loader/>}
                  {!sdkReady ? (
                    <Loader/>
                  ) : (
                    <PayPalButton  amount={orderInfo?.totalPrice} onSuccess={successPaymentHandler}/>
                  )}
                </div>
              )}
            </div>

          </div>
          {/*{!orderInfo.isPaid && <button onClick={paymentHandler}>Pay Order</button>}*/}

        </>
      )}

    </main>
  )
}
