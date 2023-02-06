import s from './stories.module.scss'
import React, { FC } from 'react'
import Loader from '../../../02_Chunks/Loader/Loader'
import { StoryCard } from '../../../02_Chunks/StoryCard/StoryCard'


type Props = {
  stories: {_id: string, title: string, image: string}[]
}

export const Stories: FC<Props> = ({stories}) => {
  return (
    <section className='stationSectionMain'>
      <div className='stationContainer'>
        <h2 className='stationSectionTitle'>Stories</h2>
        <div className='row'>
          {!stories ? (
            <Loader/>
          ) : (
            stories.map((s, i) => {
              return (
                <StoryCard
                  key={i}
                  _id={s._id}
                  title={s.title}
                  image={s.image}
                />
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}
