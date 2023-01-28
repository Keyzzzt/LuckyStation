import s from './heroSection.module.scss'
import globalStyle from './../../../02_Styles/global.module.scss'
import { FC } from 'react'
import hero from './hero.mp4'
import { Button } from '../Button/Button'
import { useTypedSelector } from '../../../05_Types/01_Base'

export const HeroSection: FC = () => {
  const { title, subTitle, text, buttonText } = useTypedSelector((state) => state.components.landingPage.hero)
  return (
    <section className={s.hero}>
      <div className={globalStyle.container + ' ' + s.container}>
        <h2 className={s.heroTitle}>{title}</h2>
        <h3 className={s.heroSubTitle}>{subTitle}</h3>
        <p className={s.heroText}>{text}</p>
        <div className={s.button}>
          <Button path="/products" colorTheme="light" padding='10px'>{buttonText}</Button>
        </div>

      </div>
      <video className={s.video} autoPlay loop muted>
        <source src={hero} type="video/mp4"/>
      </video>
    </section>
  )
}
