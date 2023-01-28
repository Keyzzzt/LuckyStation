import { FC } from 'react'
import s from './singleProductPageSlider.module.scss'

export type SliderItemProps = {
  imageSrc: string
  imageAlt: string
}

export const SliderItem: FC<SliderItemProps> = ({ imageSrc, imageAlt }) => {
  return (
    <li className={s.sliderItem}>
      <img src={imageSrc} alt={imageAlt} className={s.sliderImage} draggable={false} />
    </li>
  )
}
