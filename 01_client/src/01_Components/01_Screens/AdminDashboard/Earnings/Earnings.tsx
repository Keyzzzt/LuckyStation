import React from 'react'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { ArrowDownSVG } from '../../../02_Chunks/svg/ArrowdownSVG'
import { ChartContainer } from '../ChartContainer/ChartContainer'
import styles from './Earnings.module.scss'

export const Earnings = () => {
  const { config } = useTypedSelector((state) => state)
  const themeClass = config.colorTheme === 'light' ? styles.light_mode : styles.dark_mode
  const fill = config.colorTheme === 'light' ? '#929292' : '#fff'
  return (
    <div className={`${styles.earnings} ${themeClass}`}>
      <div className={styles.earnings__headline}>
        <h2 className={`${styles.earnings__headline__title} ${themeClass}`}>Earnings</h2>
        <div className={styles.earnings__content}>
          <div className={styles.legend}>
            <div className={styles.legend__item}>
              <div className={styles.green} />
              <span className={themeClass}>Sales</span>
            </div>
            <div className={styles.legend__item}>
              <div className={styles.orange} />
              <span className={themeClass}>Profit</span>
            </div>
          </div>
          <div className={`${styles.filter} ${themeClass}`}>
            <span>Filter</span>
            <ArrowDownSVG fillColor={fill} />
          </div>
        </div>
      </div>
      <div className={styles.earnings__chart}>
        <ChartContainer />
      </div>
    </div>
  )
}
