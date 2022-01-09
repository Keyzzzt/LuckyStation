import { ChangeEvent, FC, useRef, useState } from 'react'
import styles from './PriceRange.module.scss'
// import { useHistory } from 'react-router-dom'

export const PriceRange: FC = () => {
  const [min, setMin] = useState<number>(0)
  const [max, setMax] = useState<number>(10000)
  const [slider, setSlider] = useState('')
  // const history = useHistory()
  const inputMin = useRef(null)
  const inputMax = useRef(null)
  const gap = 1000

  // @ts-ignore
  const percentMin = (min / inputMin?.current?.max!) * 100
  // @ts-ignore
  const percentMax = 100 - (max / inputMax?.current?.max) * 100

  if (max - min < gap) {
    if (slider === 'min') {
      setMin(max - gap)
    } else {
      setMax(min + gap)
    }
  }

  const rangeHandler = (e: ChangeEvent<HTMLInputElement>, slider: string) => {
    setSlider(slider)
    slider === 'min' ? setMin(+e.target.value) : setMax(+e.target.value)
  }
  return (
    <div className={styles.priceRange}>
      <div className={styles.priceRange__header}>
        <h2>Price Range</h2>
        <p>Use slider or enter price manually</p>
      </div>
      <div className={styles.priceRange__priceInput}>
        <div className={styles.priceRange__field}>
          <span>Min</span>
          <input className={styles.inputMin} onChange={(e) => setMin(Number(e.target.value))} type="number" value={min} />
        </div>
        <div className={styles.separator}>-</div>
        <div className={styles.priceRange__field}>
          <span>Max</span>
          <input className={styles.inputMax} onChange={(e) => setMax(Number(e.target.value))} type="number" value={max} />
        </div>
      </div>
      <div className={styles.priceRange__slider}>
        <div className={styles.priceRange__progress} style={{ left: `${percentMin}%`, right: `${percentMax}%` }}></div>
      </div>
      <div className={styles.rangeInput}>
        <input data-min ref={inputMin} onChange={(e) => rangeHandler(e, 'min')} className={styles.rangeInput__min} type="range" min="0" max="10000" value={min} />
        <input ref={inputMax} onChange={(e) => rangeHandler(e, 'max')} className={styles.rangeInput__min} type="range" min="0" max="10000" value={max} />
      </div>
    </div>
  )
}
