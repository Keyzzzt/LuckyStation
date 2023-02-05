import s from './bestProducts.module.scss'
import React, { FC } from 'react'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import Loader from '../../../02_Chunks/Loader/Loader'
import { ProductCard } from '../../../02_Chunks/ProductCard/ProductCard'
import { Link } from 'react-router-dom'
import { ProductResponseType } from '../../../../05_Types/ResponseTypes'

type Props = {
  favoriteHandler: (productId: string, isFavorite: boolean) => void
  products: ProductResponseType[] | null
  favorite: string[] | undefined
}

export const BestProducts: FC<Props> = ({ products, favorite, favoriteHandler }) => {
  const { title, subTitle, buttonText } = useTypedSelector(state => state.components.landingPage.bestProducts)

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
    <section className='stationSectionMain'>
      <div className='stationContainer'>
        <h2 className='stationSectionTitle'>{title}</h2>
        <h3 className='stationSectionSubtitle'>{subTitle}</h3>
        <div className='row mt50 mh200'>
          {!products ? (
            <Loader/>
          ) : (
            products.map((product, i) => {
              return (
                <ProductCard
                  key={i}
                  _id={product._id}
                  name={product.name}
                  price={product.price}
                  image={product.images[0]}
                />
              )
            })
          )}
        </div>
        <Link className='stationSectionButton' to="/products">{buttonText}</Link>
      </div>
    </section>
  )
}
