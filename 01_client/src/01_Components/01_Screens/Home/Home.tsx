import { FC, useEffect } from 'react'
import styles from './Home.module.scss'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { useDispatch } from 'react-redux'
import { productListThunk } from '../../../03_Reducers/product/productListReducer'
import { ProductCard } from '../../02_Chunks/ProductCard/ProductCard'
import Loader from '../../02_Chunks/Loader/Loader'
import { ErrorMessage } from '../../02_Chunks/ErrorMessage/ErrorMessage'
import { useParams } from 'react-router'
import { Pagination } from '../../02_Chunks/Pagination/Pagination'
import { PriceRange } from '../../02_Chunks/PriceRange/PriceRange'
import { Tags } from '../../02_Chunks/Tags/Tags'
import { AutoResizeTextArea } from '../../02_Chunks/AutoResizeTextArea/AutoResizeTextArea'
import { getRandom } from '../../../04_Utils/utils'

type Params = {
  page: string
  limit: string
  keyword: string
}

export const Home: FC = () => {
  const { loading, error, products } = useTypedSelector((state) => state.productList)
  const dispatch = useDispatch()
  let { page, limit, keyword } = useParams<Params>()
  page = page ? page : '1'
  limit = limit ? limit : '100'

  const setPageHandler = (page: number) => {
    dispatch(productListThunk(keyword, Number(page), Number(limit)))
  }

  useEffect(() => {
    dispatch(productListThunk(keyword, Number(page), Number(limit)))
  }, [dispatch, keyword, page, limit])
  return (
    <section className={styles.products}>
      {error && <ErrorMessage message={error} />}
      {loading && <Loader />}

      <div className={styles.container}>
        <div className={styles.row}>{products && products.map((product) => <ProductCard key={getRandom()} name={product.name} _id={product._id} brand={product.brand} price={product.price} />)}</div>
      </div>

      <Pagination page={Number(page)} limit={Number(limit)} keyword={keyword} setPageHandler={setPageHandler} />
      <PriceRange />
      <Tags />
      <AutoResizeTextArea />
    </section>
  )
}
