import styles from './HeroSection.module.scss'
import { FC } from 'react'
import hero from './hero.mp4'
import { Button } from '../Button/Button'

export const HeroSection: FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>CRAFTED WITH CARE SO YOUR BABY CAN SLEEP</h1>
        <h2 className={styles.heroSubTitle}>SAFE AND SOUND</h2>
        <p className={styles.heroText}>Organic baby accessories, sustainably made</p>
        <Button path="products" colorTheme="light">
          SHOP NOW
        </Button>
      </div>
      <video className={styles.video} autoPlay loop muted>
        <source src={hero} type="video/mp4" />
      </video>
    </section>
  )
}
