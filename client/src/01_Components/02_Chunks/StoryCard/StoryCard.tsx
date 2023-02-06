import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import s from './storyCard.module.scss'
import noImage from './../../../06_img/noImage.png'

type Props = {
  _id: string
  title: string
  image: string
}

export const StoryCard: FC<Props> = ({ title, _id, image }) => {
  return (
    <div className={s.storyCard}>
        <img src={image ? image : noImage} alt='image'/>
      <Link className={s.storyLink} to={`/story/${_id}`}>{title}</Link>
    </div>
  )
}
