import styles from './ProductsList.module.scss'
import { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { ErrorMessage } from '../../../02_Chunks/ErrorMessage/ErrorMessage'
import Loader from '../../../02_Chunks/Loader/Loader'
import { Link } from 'react-router-dom'
import { productListThunk } from '../../../../03_Reducers/product/productListReducer'
import { actions } from '../../../../03_Reducers/product/productInfoReducer'
import { getRandom } from '../../../../04_Utils/utils'

export const ProductsList: FC = () => {
  const dispatch = useDispatch()
  const { config } = useTypedSelector((state) => state)
  const { products, loading, fail } = useTypedSelector((state) => state.productList)
  const themeClass = config.colorTheme === 'light' ? styles.light_mode : styles.dark_mode

  useEffect(() => {
    dispatch(productListThunk('', 1, 100))
    dispatch(actions.reset())
  }, [dispatch])
  return (
    <div className={`${styles.customerslist} ${themeClass}`}>
      {fail && <ErrorMessage message={fail} />}
      {loading && <Loader />}
      <div className={styles.customerslist__header}>
        <h2 className={`${styles.customerslist__header__title} ${themeClass}`}>Products</h2>
      </div>
      <div>
        <Link to="create">
          <button>Create new product</button>
        </Link>
      </div>
      <div className={styles.list}>
        {products?.map((product) => (
          <div key={getRandom()} className={styles.list__item}>
            <div className={styles.info}>
              <Link to={`/product/${product._id}/edit`} className={`${styles.name} ${themeClass}`}>
                {product._id}
              </Link>
              <span className={`${styles.email} ${themeClass}`}>{product.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
