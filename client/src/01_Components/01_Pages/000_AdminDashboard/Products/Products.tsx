import s from './products.module.scss'
import React, { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { Message } from '../../../02_Chunks/Message/Message'
import { productListTC } from '../../../../03_Reducers/product/productsListReducer'
import { ProductsList } from './ProductsList'
import { BreadCrumbs } from '../../../02_Chunks/Breadcrumbs/Breadcrumbs'


// TODO Add sort
// TODO Polish styles

export const Products: FC = () => {
  console.log('PRODUCTS')
  const dispatch = useDispatch()
  const { productsList, fail } = useTypedSelector(state => state.productList)
  const [productsFilter, setProductsFilter] = useState<string>('all')
  const [productsToRender, setProductsToRender] = useState<any>(null)

  useEffect(() => {
    console.log('PRODUCTS: Fetching products list')
    dispatch(productListTC('', 1, 100))
  }, [])

  useEffect(() => {
    console.log('PRODUCTS: products list received')
    if (productsList) setProductsToRender(productsList)
  }, [productsList])

  useEffect(() => {
    if (productsList) {
      switch (productsFilter) {
        case 'nameAZ':
          return setProductsToRender([...productsList].sort((a, b) => a.name.localeCompare(b.name)))
        case 'nameZA':
          return setProductsToRender([...productsList].sort((a, b) => b.name.localeCompare(a.name)))
        case 'categoryAZ':
          return setProductsToRender([...productsList].sort((a, b) => a.category.localeCompare(b.category)))
        case 'categoryZA':
          return setProductsToRender([...productsList].sort((a, b) => b.category.localeCompare(a.category)))
        case 'brandAZ':
          return setProductsToRender([...productsList].sort((a, b) => a.brand.localeCompare(b.brand)))
        case 'brandZA':
          return setProductsToRender([...productsList].sort((a, b) => b.brand.localeCompare(a.brand)))
        case 'inStockAZ':
          return setProductsToRender([...productsList].sort((a, b) => a.countInStock - b.countInStock))
        case 'inStockZA':
          return setProductsToRender([...productsList].sort((a, b) => b.countInStock - a.countInStock))
        case 'lowestPriceFirst':
          return setProductsToRender([...productsList].sort((a, b) => a.price - b.price))
        case 'highestPriceFirst':
          return setProductsToRender([...productsList].sort((a, b) => b.price - a.price))
        case 'all':
          return setProductsToRender([...productsList])
      }
    }
  }, [productsFilter])


  return (
    <div className={s.container}>
      {fail && <Message message={fail} type="fail"/>}
      {productsList?.length === 0 && <Message message='You have no products yet...' type="fail"/>}
      {productsList && (
        <>
          <BreadCrumbs pageTitle='Products' listCount={productsList.length} breadcrumbs={['dashboard', 'products']}/>
          <ProductsList products={productsToRender} setSortFilter={setProductsFilter}/>
        </>
      )}
    </div>
  )
}
