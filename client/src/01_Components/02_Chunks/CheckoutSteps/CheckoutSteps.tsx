import { FC } from 'react'
import s from './checkoutSteps.module.scss'
import { Link } from 'react-router-dom'

type Props = {
  step1?: boolean
  step2?: boolean
  step3?: boolean
}

export const CheckoutSteps: FC<Props> = ({ step1, step2, step3 }) => {
  return (
    <div className={s.container}>
      {step1 && (
        <div className={s.activeStep}>
          <Link to="/cart">
            Cart&nbsp;
          </Link>
        </div>
      )}
      {step2 ? (
        <div className={s.activeStep}>
          <Link to="/shipping">
            &nbsp;Shipping&nbsp;
          </Link>
        </div>
      ) : (
        <div className={s.passiveStep}>
          &nbsp;Shipping&nbsp;
        </div>
      )}
      {step3 ? (
        <div className={s.activeStep}>
          <Link className={s.link} to="/payment">
            &nbsp;Payment&nbsp;
          </Link>
        </div>
      ) : (
        <div className={s.passiveStep}>&nbsp;Payment&nbsp;</div>
      )}
    </div>
  )
}
