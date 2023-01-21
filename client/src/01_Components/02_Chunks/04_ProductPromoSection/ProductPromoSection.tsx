import s from './ProductPromoSection.module.scss'
import globalStyle from './../../../02_Styles/global.module.scss'
import React, { FC } from 'react'
import { Button } from '../Button/Button'
import { Product } from '../../../05_Types/APIResponse'
import { useTypedSelector } from '../../../05_Types/01_Base'

type Props = {
  favoriteHandler: (productId: string, isFavorite: boolean) => void
  products: Product[] | null
  favorite: string[] | undefined
}
type Promo = {
  title: string,
  description: string[]
  image: string,
  buttonText: string,
  path: string
}

export const ProductPromoSection: FC = () => {
  const productPromo: Promo[] = useTypedSelector(state => state.components.landingPage.productPromo)
  return (
    <section className={s.newProductsSection}>
      <div className={globalStyle.container + ' ' + s.container}>
        {productPromo.map((promo, i) => (
          <div key={i} className={i % 2 === 0 ? s.leftWrapper : s.rightWrapper}>
            <div className={i % 2 === 0 ? s.imageRight : s.imageLeft}>
              <img src="" alt=""/>
            </div>
            <div className={s.promoDescription}>
              <h3 className={i % 2 === 0 ? s.titleLeft : s.titleRight}>{promo.title}</h3>
              {promo.description.map((el, i) => (
                <div key={i} className={s.descriptionItem}>
                  {el}
                </div>
              ))}
              <div className={s.button}>
                <Button  path={promo.path}>{promo.buttonText}</Button>
              </div>

            </div>

          </div>
        ))}
      </div>
    </section>
  )
}