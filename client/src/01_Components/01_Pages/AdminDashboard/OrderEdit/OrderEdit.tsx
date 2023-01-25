import s from './orderEdit.module.scss'
import { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
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
import globalStyles from '../../../../02_Styles/global.module.scss'

type Props = {
  orderId: string
}

export const OrderEdit: FC<Props> = ({ orderId }) => {
  useScrollToTop()
  const history = useHistory()
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
    action === 'delivered' && dispatch(deliveredThunk(orderId))
    action === 'notDelivered' && dispatch(notDeliveredThunk(orderId))
    // TODO При манульном изменении статуса - ОПЛАЧЕНб необходимо указать и способ оплаты.
    action === 'paid' && dispatch(paidThunk(orderId))
    action === 'notPaid' && dispatch(notPaidThunk(orderId))
    action === 'delete' &&
    (() => {
      if (window.confirm('Are you sure you want to delete?')) {
        dispatch(deleteOrderThunk(orderId))
        history.push('/dashboard')
        return
      }
      return
    })()
  }

  useEffect(() => {
    if (!orderInfo || successDelivered || successNotDelivered || successPaid || successNotPaid || successDelete) {
      dispatch(orderInfoThunk(orderId))
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
          <table className={globalStyles.table}>
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
                    <button onClick={() => manageOrderHandler('notPaid')} className={globalStyles.success}>Paid</button>
                    <span className={s.paymentMethod}> {orderInfo.paymentMethod} </span>
                    <span className={s.paymentMethod}>{orderInfo.paidAt}</span>
                  </div>
                ) :
                <button onClick={() => manageOrderHandler('paid')} className={globalStyles.danger}>Unpaid</button>}
              </td>
            </tr>
            <tr>
              <td>Shipping</td>
              <td>
                {orderInfo.isDelivered ? <button onClick={() => manageOrderHandler('notDelivered')} className={globalStyles.success}>Delivered</button> :
                  <button onClick={() => manageOrderHandler('delivered')} className={globalStyles.danger}>Not delivered</button>}
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
            <button className={globalStyles.danger} onClick={() => manageOrderHandler('delete')}>Delete</button>
          </div>
        </>
      )}
    </div>
  )
}
