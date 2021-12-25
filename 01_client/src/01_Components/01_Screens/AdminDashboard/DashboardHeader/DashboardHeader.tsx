import React from 'react'
import { configThunk } from '../../../../03_Reducers/configReducer'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { NotificationSVG } from '../../../02_Chunks/svg/NotificationSVG'
import { SearchSVG } from '../../../02_Chunks/svg/SearchSVG'
import { ToggleSwitch } from '../../../02_Chunks/ToggleSwitch/ToggleSwitch'
import styles from './DashboardHeader.module.scss'

export const DashboardHeader = () => {
  const { config, auth } = useTypedSelector((state) => state)
  const themeClass = config.colorTheme === 'light' ? styles.light_mode : styles.dark_mode
  const iconFill = config.colorTheme === 'light' ? '#929292' : '#fff'

  return (
    <div className={styles.header}>
      <h2 className={`${styles.header__title} ${themeClass}`}>Dashboard</h2>
      <div className={styles.header__content}>
        <div className={styles.header__content__links}>
          <div className={styles.link__icon}>
            <SearchSVG fillColor={iconFill} />
          </div>
          <div className={`${styles.link__icon} ${styles.link__icon__notification}`}>
            <NotificationSVG fillColor={iconFill} />
          </div>
        </div>
      </div>
      <div className={`${styles.header__content__divider} ${themeClass}`} />
      <div className={styles.header__content__profile}>
        <span className={`${styles.profile__name} ${themeClass}`}>{auth.email}</span>
        <ToggleSwitch toggle={configThunk.toggleColorTheme()} />
        <div className={styles.profile__img}>
          <img src={'https://i.pinimg.com/originals/6b/aa/98/6baa98cc1c3f4d76e989701746e322dd.png'} alt="Profile" />
        </div>
      </div>
    </div>
  )
}
