// Done with https://www.youtube.com/watch?v=V0dfhBc2lj8

import React, { useRef, useState } from 'react'
import styles from './SingleProductPageSlider.module.scss'
import { SliderItem, SliderItemProps } from './SliderItem'
import { getRefValue, useStateRef } from '../../../04_Utils/getRefValue'
import { getTouchEventData } from '../../../04_Utils/dom'

export type Props = {
  images: SliderItemProps[]
  isNew?: boolean
}

// Sensivity value. Greater value = less swiper sensivity
const MIN_SWIPE_REQUIRE = 35

export const SingleProductPageSlider: React.FC<Props> = ({ images, isNew = false }) => {
  const containerRef = useRef<HTMLUListElement>(null)
  const containerWidthRef = useRef(0)
  const minOffsetXRef = useRef(0)
  const currentOffsetXRef = useRef(0)
  const startXRef = useRef(0)
  const [offsetX, setOffsetX, offsetXRef] = useStateRef(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const indicatorOnClick = (index: number) => {
    const containerEl = getRefValue(containerRef)
    const containerWidth = containerEl.offsetWidth

    setCurrentIndex(index)
    setOffsetX(-(containerWidth * index))
  }

  // MouseEvent доступен по дефолту, поскольку это событие отдаем объекту window.
  const onTouchMove = (e: TouchEvent | MouseEvent) => {
    const currentX = getTouchEventData(e).clientX
    const diff = getRefValue(startXRef) - currentX
    let newOffsetX = getRefValue(currentOffsetXRef) - diff

    const maxOffsetX = 0
    const minOffsetX = getRefValue(minOffsetXRef)
    if (newOffsetX > maxOffsetX) {
      newOffsetX = 0
    }
    if (newOffsetX < minOffsetX) {
      newOffsetX = minOffsetX
    }
    setIsSwiping(true)
    setOffsetX(newOffsetX)
  }
  const onTouchEnd = () => {
    const currentOffsetX = getRefValue(currentOffsetXRef)
    const containerWidth = getRefValue(containerWidthRef)

    let newOffsetX = getRefValue(offsetXRef)
    const diff = currentOffsetX - newOffsetX
    if (Math.abs(diff) > MIN_SWIPE_REQUIRE) {
      // swipe right if positive
      if (diff > 0) {
        newOffsetX = Math.floor(newOffsetX / containerWidth) * containerWidth
      } else {
        // swipe left if negative
        newOffsetX = Math.ceil(newOffsetX / containerWidth) * containerWidth
      }
    } else {
      newOffsetX = Math.round(newOffsetX / containerWidth) * containerWidth
    }

    setIsSwiping(false)
    setOffsetX(newOffsetX)
    setCurrentIndex(Math.abs(newOffsetX / containerWidth))

    window.removeEventListener('touchmove', onTouchMove)
    window.removeEventListener('touchend', onTouchEnd)
    window.removeEventListener('mousemove', onTouchMove)
    window.removeEventListener('mouseup', onTouchEnd)
  }
  // React.MouseEvent - generic, используется когда наше событие работает внутри React, не в window
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
    currentOffsetXRef.current = getRefValue(offsetXRef)
    startXRef.current = getTouchEventData(e).clientX
    const containerEl = getRefValue(containerRef)
    const containerWidth = containerEl.offsetWidth

    containerWidthRef.current = containerWidth
    minOffsetXRef.current = containerWidth - containerEl.scrollWidth

    // Передаем событие объекту window, чтобы событие работало и за пределами слайдера
    window.addEventListener('touchmove', onTouchMove)
    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('mousemove', onTouchMove)
    window.addEventListener('mouseup', onTouchEnd)
  }

  return (
    <div onTouchStart={onTouchStart} onMouseDown={onTouchStart} className={styles.sliderContainer}>
      {isNew && <div className={styles.new}>new</div>}
      <ul
        ref={containerRef}
        className={`${styles.sliderList} ${isSwiping ? styles.swiping : ''}`}
        style={{ transform: `translate3d(${offsetX}px, 0, 0)` }}
      >
        {images.map((image, index) => (
          <SliderItem key={index} {...image} />
        ))}
      </ul>
      <ul className={styles.sliderIndicator}>
        {images.map((image, i) => (
          <li
            onClick={() => indicatorOnClick(i)}
            className={`${styles.sliderIndicatorItem} ${i === currentIndex ? styles.active : ''}`}
            key={i}
            data-testid="indicator"
          />
        ))}
      </ul>
    </div>
  )
}
