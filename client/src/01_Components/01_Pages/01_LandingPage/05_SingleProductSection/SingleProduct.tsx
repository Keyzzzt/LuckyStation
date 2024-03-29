import s from './singleProduct.module.scss'
import React, { FC } from 'react'
import noImage from '../../../../06_img/noImage.png'
import { useNavigate } from 'react-router-dom'

type PromoProps = {
  productId: string
  position: 'imageLeft' | 'imageRight'
  colors: string[]
  image: string

}

export const SingleProduct: FC<PromoProps> = ({ position, colors, productId, image }) => {
  const navigate = useNavigate()
  const imageClass = position === 'imageLeft' ?  s.imageLeft  : s.imageRight
  const infoClass = position === 'imageLeft' ?  s.infoRight  : s.infoLeft
  return (
    <section className='stationSectionMain'>
      <div className='stationContainer'>
        <div className={s.product}>
          <div className={imageClass}>
            <img src="https://via.placeholder.com/640/777/999?Text=Digital.com)" alt=""/>
          </div>
          <div className={infoClass}>
            <h3 className={`stationSectionSubtitle ${s.title}`}>BUNDLE – HAMMOCK, MOTOR, AND TRIPOD STAND</h3>
            <p>The Baby-Hammock Bundle is the perfect all-rounder and companion in everyday life with a baby. With its
              elegant, all-encompassing yet robust design, it offers flexibility in any home and a safe place for a good
              night's sleep.</p>
            <div className={s.colors}>
              {colors.map((c, i) => (
                  <div className={s.colorItem} key={i}  style={{ backgroundColor: c }}/>
              ))}
            </div>
            <input className='stationSectionButton' onClick={() => navigate(`/product/${productId}`)} type="button"
                   value='View product details'/>
          </div>
        </div>
      </div>
    </section>
  )
}