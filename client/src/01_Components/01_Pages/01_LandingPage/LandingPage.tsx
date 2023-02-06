import React, { FC, useEffect, useState } from 'react'
import s from './landingPage.module.scss'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { useDispatch } from 'react-redux'
import { productListThunk } from '../../../03_Reducers/product/productListReducer'
import { Hero } from './02_HeroSection/Hero'
import { useParams } from 'react-router'
import { actions, toggleFavoriteThunk } from '../../../03_Reducers/user/userInfoReducer'
import { BestProducts } from './03_BestProductsSection/BestProducts'
import { Promo } from './04_PromoSection/Promo'
import { Outlet } from 'react-router-dom'
import { AboutSection } from './06_AboutSection/AboutSection'
import { SingleProduct } from './05_SingleProductSection/SingleProduct'
import { AboutVideoSection } from './07_AboutVideoSection/AboutVideoSection'
import { fakeStore } from '../../../04_Utils/fake'
import { Stories } from './08_StoriesSection/Stories'
import { Subscribe } from './09_SubscribeSection/Subscribe'


type Params = {
  page: string
  limit: string
  keyword: string
}
type LandingPageProps = {
  companyName: string
  aboutSectionParagraphs: string[]
}

export const LandingPage: FC<LandingPageProps> = ({companyName, aboutSectionParagraphs}) => {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { userInfo } = useTypedSelector(state => state.userInfo)
  const { fail, products } = useTypedSelector(state => state.productList)
  const dispatch = useDispatch()
  let { page, limit, keyword } = useParams<Params>()
  page = page ? page : '1'
  limit = limit ? limit : '4'

  const promoProducts = products?.filter(p => p.isPromo)
  const singleProducts = products?.filter(p => p.isShowOnMainPage)

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
  const checkLocalStorage = () => {
    const str = localStorage.getItem('isSubscribed')
    const obj = str && JSON.parse(str)
    setIsSubscribed(obj)
  }

  useEffect(() => {
    dispatch(productListThunk(keyword, Number(page), Number(limit)))
  }, [keyword, page, limit])
  useEffect(() => {
    checkLocalStorage()
  }, [])

  return (
    <>
      <Outlet/>
      <main>
        <Hero />
        <BestProducts products={products} favoriteHandler={favoriteHandler} favorite={userInfo?.favorite}/>
        <Promo promoProducts={promoProducts}/>
        {singleProducts && singleProducts.length > 0 && singleProducts.map((p, i) => (
          <SingleProduct key={i} productId={p._id} position={i % 2 === 0 ? 'imageLeft' : 'imageRight'} colors={p.colors} image={p.images[0].imageSrc} />
        ))}
        <AboutVideoSection />
        <AboutSection companyName={companyName} paragraphs={aboutSectionParagraphs} />
        {/*<Pagination page={Number(page)} limit={Number(limit)} keyword={keyword} setPageHandler={setPageHandler} />*/}
        <Stories stories={fakeStore.stories} />
        {!isSubscribed && <Subscribe setIsSubscribed={setIsSubscribed}/>}
      </main>
    </>
  )
}
