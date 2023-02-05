import s from './promo.module.scss'
import React, { FC } from 'react'
import noImage from '../../../../06_img/noImage.png'
import { useNavigate } from 'react-router-dom'
import { ProductResponseType } from '../../../../05_Types/ResponseTypes'

type PromoProps = {
  promoProducts: ProductResponseType[] | undefined
}

export const Promo: FC<PromoProps> = ({ promoProducts }) => {
  const navigate = useNavigate()
  return (
    <section className='stationSectionMain'>
      <div className='stationContainer'>
        <h2 className='stationSectionTitle'>Promo</h2>
        {promoProducts?.map((product, index) => (
          <article key={index} className={index % 2 === 0 ? s.leftWrapper : s.rightWrapper}>
            <div className={index % 2 === 0 ? s.leftWrapperImage : s.rightWrapperImage}>
              <img src={product?.images[index]?.imageSrc ? product.images[index].imageSrc : noImage} alt=""/>
            </div>
            <div className={s.promoDescription}>
              <h3 className={index % 2 === 0 ? s.titleLeft : s.titleRight}>{product.isPromo}</h3>
              <div className={index % 2 === 0 ? s.descriptionItemLeft : s.descriptionItemRight}>
                {product.description}
              </div>
              <div className={index % 2 === 0 ? s.descriptionItemLeft : s.descriptionItemRight}>
                {product.description2}
              </div>
              <div onClick={() => navigate(`/products/ID`)} className='stationSectionButton'>
                <span>Explore</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}