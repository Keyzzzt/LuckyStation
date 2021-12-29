import { FC, useState } from 'react'
import styles from './PaymentScreen.module.scss'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { CheckoutSteps } from '../../02_Chunks/CheckoutSteps/CheckoutSteps'
import { savePaymentMethodThunk } from '../../../03_Reducers/cart/cartReducer'

export const PaymentScreen: FC = () => {
  const { shippingAddress } = useTypedSelector((state) => state.cart)
  const history = useHistory()
  const dispatch = useDispatch()
  const [paymentMethod, setPaymentMethod] = useState('')

  const submitHandler = (e: any) => {
    e.preventDefault()
    dispatch(savePaymentMethodThunk(paymentMethod))
    history.push('/placeorder')
  }

  return (
    <div className={styles.container}>
      <CheckoutSteps step1 step2 step3 />
      <form onSubmit={submitHandler}>
        <div>
          <div>
            <label htmlFor="PayPal">Paypal or credit card</label>
            <input onChange={(e) => setPaymentMethod(e.target.value)} type="radio" value="PayPal" id="PayPal" />
          </div>
          <div>
            <label htmlFor="Stripe">Stripe </label>
            <input onChange={(e) => setPaymentMethod(e.target.value)} type="radio" value="Stripe" id="Stripe" />
          </div>
          <div>
            <label htmlFor="Stripe">Cash </label>
            <input onChange={(e) => setPaymentMethod(e.target.value)} type="radio" value="Cash" id="Cash" />
          </div>
        </div>
        <div>
          <input type="submit" value="Next" />
        </div>
      </form>
    </div>
  )
}
