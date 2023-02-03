import s from './heroSection.module.scss'
import { FC } from 'react'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { Link } from 'react-router-dom'

export const HeroSection: FC = () => {
  const { title, subTitle, text, buttonText } = useTypedSelector((state) => state.components.landingPage.hero)
  return (
    <section className='stationSectionMain'>
      <div className='stationContainer'>
        <h2 className='stationSectionTitle'>{title}</h2>
        <h3 className='stationSectionSubtitle'>{subTitle}</h3>
        <p className='stationSectionText'>{text}</p>
        <Link className='stationSectionButton' to="/products">{buttonText}</Link>
      </div>
    </section>
  )
}
