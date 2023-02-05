import s from './orderEdit.module.scss'
import { FC, useEffect } from 'react'
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
import { toLocal } from '../../../../04_Utils/utils'



export const OrderEdit: FC = () => {
  const {orderId} = useParams()
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
        navigate('/dashboard')
        return
      }
      return
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
          <BreadCrumbs pageTitle={'Total price ' + orderInfo.totalPrice.toLocaleString('en', toLocal)} breadcrumbs={['dashboard', 'orders', 'order']} />

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
              <td>Date created</td>
              <td>{orderInfo.createdAt}</td>
            </tr>
            {orderInfo.createdAt !== orderInfo.updatedAt && (
              <tr>
                <td>Date updated</td>
                <td>{orderInfo.updatedAt}</td>
              </tr>
            )}
            <tr>
              <td>Customer</td>
              <td>{orderInfo.user}</td>
            </tr>
            <tr>
              <td>Payment</td>
              <td>{orderInfo.isPaid
                ? (
                  <div>
                    <button onClick={() => manageOrderHandler('notPaid')} className='success'>Paid</button>
                    <span className={s.paymentMethod}> {orderInfo.paymentMethod} </span>
                    <span className={s.paymentMethod}>{orderInfo.paidAt}</span>
                  </div>
                ) :
                <button onClick={() => manageOrderHandler('paid')} className='danger'>Unpaid</button>}
              </td>
            </tr>
            <tr>
              <td>Shipping</td>
              <td>
                {orderInfo.isDelivered ? <button onClick={() => manageOrderHandler('notDelivered')} className='success'>Delivered</button> :
                  <button onClick={() => manageOrderHandler('delivered')} className='danger'>Not delivered</button>}
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
          <div className={s.buttons}>
            <button className='danger' onClick={() => manageOrderHandler('delete')}>Delete</button>
          </div>
        </>
      )}
    </div>
  )
}
