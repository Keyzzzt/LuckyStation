import React, { FC, useEffect } from 'react'
import s from './LandingPage.module.scss'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { useDispatch } from 'react-redux'
import { productListThunk } from '../../../03_Reducers/product/productListReducer'
import { ProductCard } from '../../02_Chunks/ProductCard/ProductCard'
import Loader from '../../02_Chunks/Loader/Loader'
import { Message } from '../../02_Chunks/Message/Message'
import { HeroSection } from '../../02_Chunks/02_HeroSection/HeroSection'
import { useParams } from 'react-router'
import { actions, toggleFavoriteThunk } from '../../../03_Reducers/user/userInfoReducer'
import { BestProductsSection } from '../../02_Chunks/03_BestProductsSection/BestProductsSection'
import { ProductPromoSection } from '../../02_Chunks/04_ProductPromoSection/ProductPromoSection'

type Params = {
  page: string
  limit: string
  keyword: string
}

export const LandingPage: FC = () => {
  const { userInfo } = useTypedSelector(state => state.userInfo)
  const { fail, products } = useTypedSelector(state => state.productList)
  const dispatch = useDispatch()
  let { page, limit, keyword } = useParams<Params>()
  page = page ? page : '1'
  limit = limit ? limit : '4'

  // const setPageHandler = (page: number) => {
  //   dispatch(productListThunk(keyword, Number(page), Number(limit)))
  // }

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
    <>
      <HeroSection />
      {/*Нужно сделать отдельный массив для лучших товаров = 4шт */}
      <BestProductsSection products={products} favoriteHandler={favoriteHandler} favorite={userInfo?.favorite}/>
      <ProductPromoSection />
        {/*<Pagination page={Number(page)} limit={Number(limit)} keyword={keyword} setPageHandler={setPageHandler} />*/}
    </>
  )
}
