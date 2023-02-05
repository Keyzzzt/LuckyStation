import s from './products.module.scss'
import React, { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { Message } from '../../../02_Chunks/Message/Message'
import { productListThunk } from '../../../../03_Reducers/product/productListReducer'
import { actions } from '../../../../03_Reducers/product/productInfoReducer'
import { MemoizedProductsList, ProductsList } from './ProductsList'
import { BreadCrumbs } from '../../../02_Chunks/Breadcrumbs/Breadcrumbs'


// TODO Add sort
// TODO Polish styles

export const Products: FC= () => {
  console.log('PRODUCTS')
  const dispatch = useDispatch()
  const { products, fail } = useTypedSelector(state => state.productList)
  const [productsFilter, setProductsFilter] = useState<string>('all')
  const [productsToRender, setProductsToRender] = useState<any>(null)

  useEffect(() => {
    console.log('PRODUCTS: Fetching products list')
    dispatch(productListThunk('', 1, 100))
    dispatch(actions.reset())
  }, [])

  useEffect(() => {
    console.log('PRODUCTS: products list received')
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
      <BreadCrumbs pageTitle='Products' breadcrumbs={['dashboard', 'products']}/>

      <ProductsList products={productsToRender} setSortFilter={setProductsFilter}/>
    </div>
  )
}
