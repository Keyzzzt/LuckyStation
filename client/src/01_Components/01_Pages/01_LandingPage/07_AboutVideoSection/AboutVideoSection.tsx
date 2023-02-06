import s from './aboutVideoSection.module.scss'
import React, { FC } from 'react'
import { Button } from '../../../02_Chunks/Button/Button'

type PromoProps = {

}

export const AboutVideoSection: FC<PromoProps> = () => {
  return (
    <section className={`stationSectionMain ${s.localSection}`}>
      <div className={`stationContainer ${s.localContainer}`}>
        <h2 className={`stationSectionTitle ${s.title}`}>Dear customers</h2>
        <div className={s.playButton} />
        {/*<input className='stationSubmitBtn' type="button" value='Read more'/>*/}
        <Button path='/about'>Read More</Button>

      </div>
    </section>
  )
}