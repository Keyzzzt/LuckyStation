import styles from './orderEditScreen.module.scss'
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
import { RedirectButton } from '../../../02_Chunks/BackButton/BackButton'
import { getRandom } from '../../../../04_Utils/utils'
import { PageType } from '../AdminDashboard'

type Props = {
  orderId: string
}

export const OrderEditScreen: FC<Props> = ({ orderId }) => {
  useScrollToTop()
  const history = useHistory()
  const dispatch = useDispatch()
  // const { orderId } = useParams<{ orderId: string }>()
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

  // Change order status and remove it in one single handler
  const manageOrderHandler = (action: ActionType) => {
    action === 'delivered' && dispatch(deliveredThunk(orderId))
    action === 'notDelivered' && dispatch(notDeliveredThunk(orderId))
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

  // Fetch order by id
  useEffect(() => {
    if (!orderInfo || successDelivered || successNotDelivered || successPaid || successNotPaid || successDelete) {
      dispatch(orderInfoThunk(orderId))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, successDelivered, successNotDelivered, successPaid, successNotPaid, orderId, successDelete])
  return (
    <div className={styles.container}>
      <RedirectButton path="/dashboard">Back</RedirectButton>
      <button onClick={() => manageOrderHandler('delete')}>Delete</button>
      {fail && <Message message={fail} type="fail"/>}
      {manageOrderFail && <Message message={manageOrderFail} type="fail"/>}
      {!orderInfo ? (
        <Loader/>
      ) : (
        <>
          <div>
            <div>Order Items</div>
            {orderInfo.orderItems.map(item => (
              <div key={getRandom()}>
                <div>Name: {item.name}</div>
                <div>
                  <img src={item.image} alt="Product"/>
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
            <div>
              {orderInfo.isPaid ? (
                <div>
                  <div style={{ backgroundColor: 'green' }}>Paid</div>
                  <button onClick={() => manageOrderHandler('notPaid')}>Set to not paid</button>
                </div>
              ) : (
                <div>
                  <div style={{ backgroundColor: 'red' }}>NOT Paid</div>
                  <button onClick={() => manageOrderHandler('paid')}>Set to paid</button>
                </div>
              )}
            </div>
            <div>
              {orderInfo.isDelivered ? (
                <div>
                  <div style={{ backgroundColor: 'green' }}>Delivered</div>
                  <button onClick={() => manageOrderHandler('notDelivered')}>Set to not delivered</button>
                </div>
              ) : (
                <div>
                  <div style={{ backgroundColor: 'red' }}>NOT Delivered</div>
                  <button onClick={() => manageOrderHandler('delivered')}>Set to delivered</button>
                </div>
              )}
            </div>
            {orderInfo.paidAt && <div>Paid at: {orderInfo.paidAt}</div>}
            <div>Payment method: {orderInfo.paymentMethod}</div>
          </div>
        </>
      )}
    </div>
  )
}
