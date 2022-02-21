import { FC, useEffect, useState } from 'react'
import styles from './SingleProductPageSlider.module.scss'
import { useDispatch } from 'react-redux'

export type SliderItemProps = {
  imageSrc: string
  imageAlt: string
}

export const SliderItem: FC<SliderItemProps> = ({ imageSrc, imageAlt }) => {
  return (
    <li className={styles.sliderItem}>
      <img src={imageSrc} alt={imageAlt} className={styles.sliderImage} draggable={false} />
    </li>
  )
}
