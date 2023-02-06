import s from './aboutSection.module.scss'
import React, { FC } from 'react'

type PromoProps = {
  companyName: string
  paragraphs: string[]
}

export const AboutSection: FC<PromoProps> = ({ companyName, paragraphs}) => {
  return (
    <section className='stationSectionMain'>
      <div className={`stationContainer ${s.localContainer}`}>
        <h2 className='stationSectionTitle'>{companyName}</h2>
        <div className={s.text}>
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  )
}