import { FC } from 'react'
import styles from './CheckoutSteps.module.scss'
import { Link } from 'react-router-dom'

type Props = {
  step1?: boolean
  step2?: boolean
  step3?: boolean
  step4?: boolean
}

export const CheckoutSteps: FC<Props> = ({ step1, step2, step3, step4 }) => {
  return (
    <div className={styles.container}>
      {step1 ? (
        <div>
          <Link to="/cart">Cart-</Link>
        </div>
      ) : (
        <div>
          <div>-Cart-</div>
        </div>
      )}
      {step2 ? (
        <div>
          <Link to="/shipping">Shipping-</Link>
        </div>
      ) : (
        <div>
          <div>-Shipping-</div>
        </div>
      )}
      {step3 ? (
        <div>
          <Link to="/payment">Payment-</Link>
        </div>
      ) : (
        <div>
          <div>Payment-</div>
        </div>
      )}

      {step4 ? (
        <div>
          <Link to="/placeorder">Place Order</Link>
        </div>
      ) : (
        <div>
          <div>Place Order</div>
        </div>
      )}
    </div>
  )
}
