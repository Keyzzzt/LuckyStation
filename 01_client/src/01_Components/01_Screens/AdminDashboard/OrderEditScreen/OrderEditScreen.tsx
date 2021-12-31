import { FC, useEffect, useState } from 'react'
import styles from './OrderEditScreen.module.scss'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { ErrorMessage } from '../../../02_Chunks/ErrorMessage/ErrorMessage'
import { useScrollToTop } from '../../../../04_Utils/hooks'
import Loader from '../../../02_Chunks/Loader/Loader'
import { orderInfoThunk } from '../../../../03_Reducers/order/orderInfoReducer'
import { setToDeliveredThunk, setToPaidThunk } from '../../../../03_Reducers/order/orderManageReducer'
const { v4: uuidv4 } = require('uuid')

export const OrderEditScreen: FC = () => {
  useScrollToTop()
  const history = useHistory()
  const dispatch = useDispatch()
  const { userInfo } = useTypedSelector((state) => state.userInfo)
  const { orderId } = useParams<{ orderId: string }>()
  const { orderInfo, error, loading } = useTypedSelector((state) => state.orderInfo)

  if (!userInfo) {
    history.push('/login?redirect=dashboard')
  }
  if (userInfo && !userInfo.isAdmin) {
    history.push('/')
  }

  const deleteHandler = (id: string, name: string) => {
    // if (window.confirm(`Are you sure you want to delete ${name}?`)) {
    //   dispatch(productDeleteThunk(id))
    //   alert(`${name} has been removed`)
    //   history.push('/dashboard')
    // }
    // return
  }

  const returnHandler = () => {
    history.push('/dashboard')
  }

  const setToDeliveredHandler = () => {
    dispatch(setToDeliveredThunk(orderId))
  }
  const setToPaidHandler = () => {
    dispatch(setToPaidThunk(orderId))
  }
  useEffect(() => {
    dispatch(orderInfoThunk(orderId))
  }, [dispatch])

  return (
    <div className={styles.container}>
      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}

      <div>
        <div>Order Items</div>
        {orderInfo?.orderItems.map((item) => (
          <div key={uuidv4()}>
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
        <div>Tax price: {orderInfo?.taxPrice}</div>
        <div>Shipping price: {orderInfo?.shippingPrice}</div>
        <div>Total price: {orderInfo?.totalPrice}</div>
        <div>
          Shipping address:{' '}
          {`${orderInfo?.shippingAddress.address}, ${orderInfo?.shippingAddress.postalCode}, ${orderInfo?.shippingAddress.city}, ${orderInfo?.shippingAddress.country}`}
        </div>
        <div>Created at: {orderInfo?.createdAt}</div>
        <div onClick={setToPaidHandler}>
          {orderInfo?.isPaid ? <div style={{ backgroundColor: 'green' }}>Paid</div> : <div style={{ backgroundColor: 'red' }}>NOT Paid</div>}
        </div>
        <div onClick={setToDeliveredHandler}>
          {orderInfo?.isDelivered ? (
            <div style={{ backgroundColor: 'green' }}>Delivered</div>
          ) : (
            <div style={{ backgroundColor: 'red' }}>NOT Delivered</div>
          )}
        </div>
        {orderInfo?.paidAt && <div>Paid at: {orderInfo?.paidAt}</div>}
        <div>Payment method: {orderInfo?.paymentMethod}</div>
      </div>
    </div>
  )
}
