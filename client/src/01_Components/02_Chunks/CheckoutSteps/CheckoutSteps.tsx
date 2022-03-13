import { FC } from 'react'
import styles from './CheckoutSteps.module.scss'
import { Link } from 'react-router-dom'

type Props = {
  step1?: boolean
  step2?: boolean
  step3?: boolean
}

export const CheckoutSteps: FC<Props> = ({ step1, step2, step3 }) => {
  return (
    <div className={styles.container}>
      {step1 ? (
        <div>
          <Link to="/cart">
            Cart&nbsp;
            <i className={`fa-solid fa-chevron-right`} />
          </Link>
        </div>
      ) : (
        <div>
          <div>
            &nbsp;
            <i className={`fa-solid fa-chevron-right`} />
          </div>
        </div>
      )}
      {step2 ? (
        <div>
          <Link to="/shipping">
            &nbsp;Shipping&nbsp;
            <i className={`fa-solid fa-chevron-right`} />
          </Link>
        </div>
      ) : (
        <div>
          <div>
            &nbsp;Shipping&nbsp;
            <i className={`fa-solid fa-chevron-right`} />
          </div>
        </div>
      )}
      {step3 ? (
        <div>
          <Link className={styles.link} to="/payment">
            &nbsp;Payment&nbsp;
          </Link>
        </div>
      ) : (
        <div>
          <div>&nbsp;Payment&nbsp;</div>
        </div>
      )}
    </div>
  )
}
