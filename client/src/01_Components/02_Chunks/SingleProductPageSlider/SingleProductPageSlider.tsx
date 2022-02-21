// Done with https://www.youtube.com/watch?v=V0dfhBc2lj8
// 45:00
import { useRef } from 'react'
import styles from './SingleProductPageSlider.module.scss'
import { SliderItem, SliderItemProps } from './SliderItem'
import { getRefValue, useStateRef } from '../../../04_Utils/getRefValue'
import { getTouchEventData } from '../../../04_Utils/dom'

type Props = {
  images: SliderItemProps[]
}

export const SingleProductPageSlider: React.FC<Props> = ({ images }) => {
  const containerRef = useRef<HTMLUListElement>(null)
  const minOffsetXRef = useRef(0)
  const currentOffsetXRef = useRef(0)
  const startXRef = useRef(0)
  const [offsetX, setOffsetX, offsetXRef] = useStateRef(0)

  // MouseEvent доступен по дефолту, поскольку это событие отдаем объекту window.
  const onTouchMove = (e: TouchEvent | MouseEvent) => {
    const currentX = getTouchEventData(e).clientX
    const diff = getRefValue(startXRef) - currentX
    let newOffsetX = getRefValue(currentOffsetXRef) - diff

    const maxOffsetX = 0
    if (newOffsetX > maxOffsetX) {
      newOffsetX = 0
    }

    setOffsetX(newOffsetX)
  }
  const onTouchEnd = () => {
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
    minOffsetXRef = containerEl.offsetWidth - containerEl.scrollWidth

    // Передаем событие объекту window, чтобы событие работало и за пределами слайдера
    window.addEventListener('touchmove', onTouchMove)
    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('mousemove', onTouchMove)
    window.addEventListener('mouseup', onTouchEnd)
  }

  return (
    <div onTouchStart={onTouchStart} onMouseDown={onTouchStart} className={styles.sliderContainer}>
      <ul ref={containerRef} className={styles.sliderList} style={{ transform: `translate3d(${offsetX}px, 0, 0)` }}>
        {images.map((image, index) => (
          <SliderItem key={index} {...image} />
        ))}
      </ul>
    </div>
  )
}
