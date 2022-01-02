import { ChangeEvent, FC, useRef, useState } from 'react'
import styles from './PriceRange.module.scss'
import { useHistory } from 'react-router-dom'

export const PriceRange: FC = () => {
  const [min, setMin] = useState<number>(0)
  const [max, setMax] = useState<number>(10000)
  const history = useHistory()
  const inputMin = useRef(null)
  const inputMax = useRef(null)
  const priceGap = 1000

  // @ts-ignore
  const percentMin = (min! / inputMin?.current?.max) * 100
  // @ts-ignore
  const percentMax = 100 - (max! / inputMax?.current?.max) * 100

  // if (max! - min! < priceGap) {
  //   //@ts-ignore
  //   inputMin.current.max = max - priceGap
  // }

  const setMinHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (max - min < priceGap && max <= 10000) {
      setMax(min + priceGap)
    } else if (min <= max - priceGap) {
      setMin(+e.currentTarget.value)
    } else {
      return
    }
  }
  const setMaxHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (max - min < priceGap && min >= 0) {
      setMin(max - priceGap)
    } else if (max >= min + priceGap) {
      setMax(+e.currentTarget.value)
    } else {
      return
    }
  }

  // max - min < priceGap ? max - priceGap : min
  // max - min < priceGap ? min + priceGap : max
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
        <input ref={inputMin} onChange={setMinHandler} className={styles.rangeInput__min} type="range" min="0" max="10000" value={min} />
        <input ref={inputMax} onChange={setMaxHandler} className={styles.rangeInput__min} type="range" min="0" max="10000" value={max} />
      </div>
    </div>
  )
}
