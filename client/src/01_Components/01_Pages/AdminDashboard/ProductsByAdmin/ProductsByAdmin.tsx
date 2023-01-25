import s from './productsByAdmin.module.scss'
import globalStyles from './../../../../02_Styles/global.module.scss'
import { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { Message } from '../../../02_Chunks/Message/Message'
import { productListThunk } from '../../../../03_Reducers/product/productListReducer'
import { actions } from '../../../../03_Reducers/product/productInfoReducer'
import { PageType } from '../AdminDashboard'
import { ProductList } from './ProductsList'


// TODO Add sort
// TODO Polish styles

type Props = {
  setPage: (page: PageType) => void
  setProductId: (productId: string) => void

}

export const ProductsByAdmin: FC<Props> = ({ setPage, setProductId }) => {
  const dispatch = useDispatch()
  const { products, fail } = useTypedSelector(state => state.productList)
  const [productsFilter, setProductsFilter] = useState<string>('all')
  const [productsToRender, setProductsToRender] = useState<any>(null)

  useEffect(() => {
    dispatch(productListThunk('', 1, 100))
    dispatch(actions.reset())
  }, [])

  useEffect(() => {
    if (products) setProductsToRender(products)
  }, [products])

  useEffect(() => {
    if (products) {
      switch (productsFilter) {
        case 'nameAZ':
          return setProductsToRender([...products].sort((a, b) => a.name.localeCompare(b.name)))
        case 'nameZA':
          return setProductsToRender([...products].sort((a, b) => b.name.localeCompare(a.name)))
        case 'categoryAZ':
          return setProductsToRender([...products].sort((a, b) => a.category.localeCompare(b.category)))
        case 'categoryZA':
          return setProductsToRender([...products].sort((a, b) => b.category.localeCompare(a.category)))
        case 'brandAZ':
          return setProductsToRender([...products].sort((a, b) => a.brand.localeCompare(b.brand)))
        case 'brandZA':
          return setProductsToRender([...products].sort((a, b) => b.brand.localeCompare(a.brand)))
        case 'inStockAZ':
          return setProductsToRender([...products].sort((a, b) => a.countInStock - b.countInStock))
        case 'inStockZA':
          return setProductsToRender([...products].sort((a, b) => b.countInStock - a.countInStock))
        case 'lowestPriceFirst':
          return setProductsToRender([...products].sort((a, b) => a.price - b.price))
        case 'highestPriceFirst':
          return setProductsToRender([...products].sort((a, b) => b.price - a.price))
        case 'all':
          return setProductsToRender([...products])
      }
    }
  }, [productsFilter])


  return (
    <div className={s.container}>
      {fail && <Message message={fail} type="fail"/>}
      {products?.length === 0 && <Message message='You have no products yet...' type="fail"/>}
      <div className={s.header}>
        <h2 className={s.title}>Products</h2>
      </div>
      <ProductList products={productsToRender} setPage={setPage} setProductId={setProductId}
                   setSortFilter={setProductsFilter}/>
    </div>
  )
}
