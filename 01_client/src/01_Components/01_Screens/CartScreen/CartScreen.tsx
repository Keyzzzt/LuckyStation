import { FC, useEffect } from 'react'
import styles from './CartScreen.module.scss'
import { useDispatch } from 'react-redux'
import { useLocation, useParams } from 'react-router'
import { Link, useHistory } from 'react-router-dom'
import { addToCartThunk, removeFromCartThunk } from '../../../03_Reducers/cart/cartReducer'
import { useTypedSelector } from '../../../05_Types/01_Base'

export const CartScreen: FC = () => {
  const { productId } = useParams<{ productId: string }>()
  const { search } = useLocation()
  const history = useHistory()
  const dispatch = useDispatch()
  const { cartItems } = useTypedSelector((state) => state.cart)
  const qty = search ? Number(search.split('=')[1]) : 1

  const removeFromCartHandler = (productId: string) => {
    dispatch(removeFromCartThunk(productId))
  }
  const checkOutHandler = () => {
    history.push('/login?redirect=shipping')
  }

  useEffect(() => {
    if (productId) {
      dispatch(addToCartThunk(productId, qty))
    }
  }, [dispatch, productId, qty])

  return (
    <div className={styles.container}>
      <div className={styles.cart}>
        <h1 style={{ fontSize: '30px' }}>Cart</h1>
        {cartItems.length === 0 ? (
          <div>
            Cart is empty<Link to="/">Go back</Link>
          </div>
        ) : (
          <div>
            {cartItems.map((item) => (
              <div key={item._id}>
                <Link to={`/product/${item._id}`}>
                  <img src={item.image} alt="" />
                </Link>
                <div>
                  <Link to={`/product/${item._id}`}>{item.name}</Link>
                </div>
                <div>Price: {item.price}</div>
                <div>
                  {/* FIXME item.qty! */}
                  <select value={item.qty} onChange={(e) => dispatch(addToCartThunk(item._id, Number(e.target.value)))}>
                    {[...Array(item.countInStock).keys()].map((n) => (
                      <option key={item._id} value={n + 1}>
                        {n + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <button onClick={() => removeFromCartHandler(item._id)}>Remove from cart</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={styles.cart2}>
        <div>Subtotal: {cartItems.reduce((acc, item) => acc + item.qty!, 0)}</div>
        <div>$: {cartItems.reduce((acc, item) => acc + item.price! * item.qty!, 0)}</div>
        <button onClick={checkOutHandler} disabled={cartItems.length === 0}>
          Checkout
        </button>
      </div>
      <div className={styles.cart3}></div>
    </div>
  )
}
