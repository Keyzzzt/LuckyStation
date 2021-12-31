import { FC, useState } from 'react'
import styles from './ShippingScreen.module.scss'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { saveAddressThunk } from '../../../03_Reducers/cart/cartReducer'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { CheckoutSteps } from '../../02_Chunks/CheckoutSteps/CheckoutSteps'

export const ShippingScreen: FC = () => {
  const { shippingAddress } = useTypedSelector((state) => state.cart)
  const history = useHistory()
  const dispatch = useDispatch()
  const [address, setAddress] = useState(shippingAddress.address)
  const [city, setCity] = useState(shippingAddress.city)
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
  const [country, setCountry] = useState(shippingAddress.country)

  const submitHandler = (e: any) => {
    e.preventDefault()
    dispatch(
      saveAddressThunk({
        address,
        city,
        postalCode,
        country,
      })
    )
    history.push('/payment')
  }
  return (
    <div className={styles.container}>
      <CheckoutSteps step1 step2 />
      <form onSubmit={submitHandler}>
        <div>
          <input onChange={(e) => setAddress(e.target.value)} type="text" value={address} placeholder="Address" required />
        </div>
        <div>
          <input onChange={(e) => setCity(e.target.value)} type="text" value={city} placeholder="City" required />
        </div>
        <div>
          <input onChange={(e) => setPostalCode(e.target.value)} type="text" value={postalCode} placeholder="Postal code" required />
        </div>
        <div>
          <input onChange={(e) => setCountry(e.target.value)} type="text" value={country} placeholder="Country" required />
        </div>
        <div>
          <input type="submit" value="Next" />
        </div>
      </form>
    </div>
  )
}
