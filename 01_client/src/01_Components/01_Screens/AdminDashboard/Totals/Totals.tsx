import { FC } from 'react'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { TotalCostSVG } from '../../../02_Chunks/svg/TotalCostSVG'
import { TotalProfitSVG } from '../../../02_Chunks/svg/TotalProfitSVG'
import { TotalSalesSVG } from '../../../02_Chunks/svg/TotalSalesSVG'
import styles from './Totals.module.scss'

const iconFill = '#33c863'
const totalCards = [
  { id: 1, title: 'Total sales', total: '$512', icon: <TotalSalesSVG fillColor={iconFill} /> },
  { id: 2, title: 'Total profit', total: '$112', icon: <TotalProfitSVG fillColor={iconFill} /> },
  { id: 3, title: 'Total cost', total: '$400', icon: <TotalCostSVG fillColor={iconFill} /> },
]

export const Totals: FC = () => {
  const { config } = useTypedSelector((state) => state)
  const themeClass = config.colorTheme === 'light' ? styles.light_mode : styles.dark_mode
  return (
    <div className={styles.totals}>
      {totalCards.map(({ id, title, total, icon }) => (
        <div key={id} className={`${styles.totals__card} ${themeClass}`}>
          <div className={styles.totals__card__icon}>
            <div className={styles.icon}>{icon}</div>
          </div>
          <div className={styles.totals__card__info}>
            <div className={`${styles.title} ${themeClass}`}>{title}</div>
            <div className={`${styles.total} ${themeClass}`}>{total}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
