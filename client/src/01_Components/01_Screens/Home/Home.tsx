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
import { getRandom } from '../../../04_Utils/utils'
import { actions, toggleFavoriteThunk } from '../../../03_Reducers/user/userInfoReducer'
import { VerticalSlider } from '../../02_Chunks/VerticalSlider/VerticalSlider'

type Params = {
  page: string
  limit: string
  keyword: string
}

// TODO сломан поиск, реализовать не через get строку а через параметры, либо, если не надо делать запрос на сервер сразу сделать поиск на фронте

export const Home: FC = () => {
  const { loading, fail, products } = useTypedSelector((state) => state.productList)
  const { userInfo } = useTypedSelector((state) => state.userInfo)
  const dispatch = useDispatch()
  let { page, limit, keyword } = useParams<Params>()
  page = page ? page : '1'
  limit = limit ? limit : '4'

  const setPageHandler = (page: number) => {
    dispatch(productListThunk(keyword, Number(page), Number(limit)))
  }

  const favoriteHandler = (productId: string, isFavorite: boolean) => {
    dispatch(toggleFavoriteThunk(productId, isFavorite))
    if (isFavorite) {
      dispatch(actions.removeFromFavoriteAC(productId))
    } else {
      dispatch(actions.addToFavoriteAC(productId))
    }
  }

  useEffect(() => {
    dispatch(productListThunk(keyword, Number(page), Number(limit)))
  }, [dispatch, keyword, page, limit])

  return (
    <section className={styles.products}>
      {fail && <ErrorMessage message={fail} />}
      {loading && <Loader />}
      <VerticalSlider />
      <div className={styles.container}>
        <div className={styles.row}>
          {products &&
            products.map((product) => {
              const isFavorite = userInfo?.favorite?.find((x) => x === product._id) ? true : false
              return (
                <ProductCard
                  key={getRandom()}
                  favoriteHandler={favoriteHandler}
                  isFavorite={isFavorite}
                  name={product.name}
                  _id={product._id}
                  brand={product.brand}
                  price={product.price}
                  image={product.image}
                />
              )
            })}
        </div>
      </div>
      <Pagination page={Number(page)} limit={Number(limit)} keyword={keyword} setPageHandler={setPageHandler} />
    </section>
  )
}
