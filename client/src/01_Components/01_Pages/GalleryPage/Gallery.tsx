import s from './gallery.module.scss'
import React, { FC } from 'react'


type GalleryProps = {
  images: {src: string, class: 'vertical | horizontal | big', title: string}[]
}
export const Gallery: FC = () => {



  return (
    <main className='stationSectionMain'>
      <div className={`stationContainer ${s.localContainer}`}>
        <div className={s.gallery}>
          <div>
            <img src="https://via.placeholder.com/350" alt=""/>
          </div>
          <div className={s.v_stretch}>
            <img src="https://via.placeholder.com/350" alt=""/>
          </div>
          <div className={s.h_stretch}>
            <img src="https://via.placeholder.com/350" alt=""/>
          </div>
          <div>
            <img src="https://via.placeholder.com/350" alt=""/>
          </div>
          <div>
            <img src="https://via.placeholder.com/350" alt=""/>
          </div>
          <div className={s.v_stretch}>
            <img src="https://via.placeholder.com/350" alt=""/>
          </div>
          <div className={s.big_stretch}>
            <img src="https://via.placeholder.com/450" alt=""/>
          </div>
          <div>
            <img src="https://via.placeholder.com/350" alt=""/>
          </div>
          <div className={s.h_stretch}>
            <img src="https://via.placeholder.com/350" alt=""/>
          </div>
          <div>
            <img src="https://via.placeholder.com/350" alt=""/>
          </div>
          <div>
            <img src="https://via.placeholder.com/350" alt=""/>
          </div>
          <div>
            <img src="https://via.placeholder.com/350" alt=""/>
          </div>
          <div className={s.v_stretch}>
            <img src="https://via.placeholder.com/350" alt=""/>
          </div>
          <div>
            <img src="https://via.placeholder.com/350" alt=""/>
          </div>
          <div className={s.big_stretch}>
            <img src="https://via.placeholder.com/450" alt=""/>
          </div>
          <div>
            <img src="https://via.placeholder.com/350" alt=""/>
          </div>
          <div className={s.h_stretch}>
            <img src="https://via.placeholder.com/350" alt=""/>
          </div>
          <div>
            <img src="https://via.placeholder.com/350" alt=""/>
          </div>
          <div className={s.h_stretch}>
            <img src="https://via.placeholder.com/450" alt=""/>
          </div>
          <div>
            <img src="https://via.placeholder.com/350" alt=""/>
          </div>
          <div>
            <img src="https://via.placeholder.com/350" alt=""/>
          </div>
          <div>
            <img src="https://via.placeholder.com/350" alt=""/>
          </div>
          <div>
            <img src="https://via.placeholder.com/350" alt=""/>
          </div>
      </div>
      </div>
    </main>
  )
}
