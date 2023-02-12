import s from './orderEdit.module.scss'
import React, { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { Message } from '../../../02_Chunks/Message/Message'
import Loader from '../../../02_Chunks/Loader/Loader'
import { useScrollToTop } from '../../../../04_Utils/hooks'
import { orderInfoThunk } from '../../../../03_Reducers/order/orderInfoReducer'
import {
  deleteOrderThunk,
  deliveredThunk,
  notDeliveredThunk,
  notPaidThunk,
  paidThunk,
} from '../../../../03_Reducers/order/orderManageReducer'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router'
import { BreadCrumbs } from '../../../02_Chunks/Breadcrumbs/Breadcrumbs'
import { parseCreatedUpdated, toLocal } from '../../../../04_Utils/utils'
import { Button } from '../../../02_Chunks/Button/Button'


export const OrderEdit: FC = () => {
  const { orderId } = useParams()
  useScrollToTop()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { orderInfo, fail } = useTypedSelector(state => state.orderInfo)
  const {
    successDelivered,
    successNotDelivered,
    successPaid,
    successNotPaid,
    successDelete,
    fail: manageOrderFail,
  } = useTypedSelector(state => state.orderManage)

  type ActionType = 'delivered' | 'notDelivered' | 'paid' | 'notPaid' | 'delete'

  const manageOrderHandler = (action: ActionType) => {
    action === 'delivered' && orderId && dispatch(deliveredThunk(orderId))
    action === 'notDelivered' && orderId && dispatch(notDeliveredThunk(orderId))
    // TODO When we change status to paid, need to give payment method.
    action === 'paid' && orderId && dispatch(paidThunk(orderId))
    action === 'notPaid' && orderId && dispatch(notPaidThunk(orderId))
    action === 'delete' &&
    (() => {
      if (window.confirm('Are you sure you want to delete?')) {
        orderId && dispatch(deleteOrderThunk(orderId))
        navigate('/dashboard/orders')
      }
    })()
  }


  useEffect(() => {
    if (!orderInfo || successDelivered || successNotDelivered || successPaid || successNotPaid || successDelete) {
      orderId && dispatch(orderInfoThunk(orderId))
    }
  }, [dispatch, successDelivered, successNotDelivered, successPaid, successNotPaid, orderId, successDelete])
  return (
    <div className={s.container}>
      {fail && <Message message={fail} type="fail"/>}
      {manageOrderFail && <Message message={manageOrderFail} type="fail"/>}
      {!orderInfo ? (
        <Loader/>
      ) : (
        <>
          <BreadCrumbs pageTitle={'Total price ' + orderInfo.totalPrice.toLocaleString('en', toLocal)}
                       breadcrumbs={['dashboard', 'orders', 'order']}/>

          <table className='stationTable'>
            <thead>
            <tr>
              <th>
                <div>Field</div>
              </th>
              <th>
                <div>Value</div>
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>ID</td>
              <td>{orderInfo._id}</td>
            </tr>
            <tr>
              <td>Created</td>
              <td>{parseCreatedUpdated(orderInfo.createdAt).date} / {parseCreatedUpdated(orderInfo.createdAt).time}</td>
            </tr>
            {orderInfo.createdAt !== orderInfo.updatedAt && (
              <tr>
                <td>Last updated</td>
                <td>{parseCreatedUpdated(orderInfo.updatedAt).date} / {parseCreatedUpdated(orderInfo.updatedAt).time}</td>
              </tr>
            )}
            <tr>
              <td>Customer </td>
              <td>TODO link to customers profile</td>
            </tr>
            <tr>
              <td>Payment</td>
              <td>{orderInfo.isPaid
                ? <Button onClick={() => manageOrderHandler('notPaid')} title='Paid' type='button' color='success'
                          marginTop='0' width='110px' padding='3px'/>
                : <Button onClick={() => manageOrderHandler('paid')} title='Unpaid' type='button' color='danger'
                          marginTop='0' width='110px' padding='3px'/>
              }

              </td>
            </tr>
            <tr>
              <td>Shipping</td>
              <td>
                {orderInfo.isDelivered
                  ? <Button onClick={() => manageOrderHandler('notDelivered')} title='Delivered' type='button'
                            color='success' marginTop='0' width='110px' padding='3px'/>
                  : <Button onClick={() => manageOrderHandler('delivered')} title='Not delivered' type='button'
                            color='danger' marginTop='0' width='110px' padding='3px'/>
                }
              </td>
            </tr>
            <tr>
              <td>Shipping address</td>
              <td>{orderInfo.shippingAddress.address}, {orderInfo.shippingAddress.postalCode}, {orderInfo.shippingAddress.city}, {orderInfo.shippingAddress.country}</td>
            </tr>
            <tr>
              <td>Items</td>
              <td>{orderInfo.orderItems.length}</td>
            </tr>
            <tr>
              <td>Items price</td>
              <td>{orderInfo.itemsPrice}</td>
            </tr>
            <tr>
              <td>Shipping price</td>
              <td>{orderInfo.shippingPrice}</td>
            </tr>
            <tr>
              <td>Tax price</td>
              <td>{orderInfo.taxPrice}</td>
            </tr>
            <tr>
              <td>Total price</td>
              <td>{orderInfo.totalPrice}</td>
            </tr>
            </tbody>
          </table>
          <Button onClick={() => manageOrderHandler('delete')} title='Delete' type='submit' color='danger' marginTop='20px' width='100px'/>
        </>
      )}
    </div>
  )
}
