import React, { useEffect } from 'react'
import styles from './Home.module.scss'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { useDispatch } from 'react-redux'
import { productListThunk } from '../../../03_Reducers/product/productListReducer'
import Loader from '../../02_Chunks/Loader/Loader'
import { ErrorMessage } from '../../02_Chunks/ErrorMessage/ErrorMessage'
import { Link } from 'react-router-dom'
import { ProductCard } from '../../02_Chunks/ProductCard/ProductCard'

export const Home: React.FC = () => {
  const { loading, error, products } = useTypedSelector((state) => state.productList)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(productListThunk(1, 100))
  }, [dispatch])
  return (
    <section className={styles.products}>
      <div className={styles.container}>
        <div className={styles.row}>
          {products && products.map((product) => <ProductCard name={product.name} _id={product._id} brand={product.brand} price={product.price} />)}
        </div>
      </div>
    </section>
  )
}
