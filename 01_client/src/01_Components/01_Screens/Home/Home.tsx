import { FC, useEffect } from 'react'
import styles from './Home.module.scss'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { useDispatch } from 'react-redux'
import { productListThunk } from '../../../03_Reducers/product/productListReducer'
import { ProductCard } from '../../02_Chunks/ProductCard/ProductCard'
import Loader from '../../02_Chunks/Loader/Loader'
import { ErrorMessage } from '../../02_Chunks/ErrorMessage/ErrorMessage'
import { v4 as uuidv4 } from 'uuid'
import { useParams } from 'react-router'
import { Pagination } from '../../Pagination/Pagination'
import { PriceRange } from '../../02_Chunks/PriceRange/PriceRange'
import { Tags } from '../../02_Chunks/Tags/Tags'
// import { PaginationV2 } from '../../03_Chunks_unused/PaginationV2/PaginationV2'
type Params = {
  page: string
  limit: string
  keyword: string
}
export const Home: FC = () => {
  const { loading, error, products } = useTypedSelector((state) => state.productList)
  const dispatch = useDispatch()
  let { page } = useParams<Params>()
  let { limit } = useParams<Params>()
  const { keyword } = useParams<Params>()
  page = page ? page : '1'
  limit = limit ? limit : '1'

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
        <div className={styles.row}>{products && products.map((product) => <ProductCard key={uuidv4()} name={product.name} _id={product._id} brand={product.brand} price={product.price} />)}</div>
      </div>

      <Pagination page={Number(page)} limit={Number(limit)} keyword={keyword} setPageHandler={setPageHandler} />
      <PriceRange />
      <Tags />
    </section>
  )
}
