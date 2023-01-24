import s from './BestProductsSection.module.scss'
import globalStyle from './../../../02_Styles/global.module.scss'
import React, { FC } from 'react'
import { Button } from '../Button/Button'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { Product } from '../../../05_Types/APIResponse'
import Loader from '../Loader/Loader'
import { ProductCard } from '../ProductCard/ProductCard'

type Props = {
  favoriteHandler: (productId: string, isFavorite: boolean) => void
  products: Product[] | null
  favorite: string[] | undefined
}

export const BestProductsSection: FC<Props> = ({products, favorite, favoriteHandler}) => {
  const {title, subTitle, buttonText} = useTypedSelector(state => state.components.landingPage.bestProducts)

  // // By default - not favorite
  // let isFavorite = false
  //  // Check if user logged inn, and if product in favorites
  // if(favorite && products){
  //   for (var i = 0; i < products.length; i++) {
  //     for (var j = 0; j< favorite.length; j++) {
  //       if(products[i]._id === favorite[j]){
  //         isFavorite = true
  //       }
  //     }
  //   }
  // }
  // // If not logged inn, then check localStorage
  // if(!favorite){
  //
  // }

  return (
    <section className={s.newProductsSection}>
      <div className={globalStyle.container + ' ' + s.container}>
        <h1 className={s.title}>{title}</h1>
        <h1 className={s.subTitle}>{subTitle}</h1>
        <div className={s.productsWrapper}>
          {!products ? (
            <Loader />
          ) : (
            products.map((product, i) => {
              return (
                <ProductCard
                  key={i}
                  _id={product._id}
                  name={product.name}
                  favoriteHandler={favoriteHandler}
                  isFavorite={false}
                  price={product.price}
                  image={product.images[0]}
                />
              )
            })
          )}
        </div>
        <div className={s.button}>
          <Button path="products" colorTheme="dark">{buttonText}</Button>
        </div>
      </div>
    </section>
  )
}
