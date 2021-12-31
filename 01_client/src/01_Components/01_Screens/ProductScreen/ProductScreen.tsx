import { FC, useEffect } from 'react'
import styles from './ProductScreen.module.scss'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { useDispatch } from 'react-redux'
import Loader from '../../02_Chunks/Loader/Loader'
import { ErrorMessage } from '../../02_Chunks/ErrorMessage/ErrorMessage'
import { ProductInfo } from '../../02_Chunks/ProductInfo/ProductInfo'
import { productInfoThunk } from '../../../03_Reducers/product/productInfoReducer'
import { useParams } from 'react-router'

export const ProductScreen: FC = () => {
  const params = useParams<{ productId: string }>()
  const { loading, error, productInfo } = useTypedSelector((state) => state.productInfo)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(productInfoThunk(params.productId))
  }, [dispatch, params.productId])
  return <div className={styles.container}>{loading ? <Loader /> : error ? <ErrorMessage message={error} /> : <ProductInfo {...productInfo} />}</div>
}
