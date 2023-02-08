import s from './gallery.module.scss'
import React, { FC, useState, KeyboardEvent, useEffect } from 'react'
import { GalleryListItemType, gallerySingleItemThunk } from '../../../03_Reducers/galleryReducer'
import { useDispatch } from 'react-redux'

// TODO Close on Esc & click outside
type GalleryProps = {
  items: GalleryListItemType[]
  item?: GalleryListItemType | null
}
export const Gallery: FC<GalleryProps> = ({ items, item }) => {
  const dispatch = useDispatch()
  const [modal, setModal] = useState(false)
  const handleShowImage = (itemId: string) => {
    setModal(true)
    dispatch(gallerySingleItemThunk(itemId))
  }


  return (
    <main className='stationSectionMain'>
      <div className={`stationContainer ${s.localContainer}`}>
        <div  className={modal ? `${s.modal} ${s.open}` : s.modal}>
          <div className={s.imageWrapper}>
            <img src={item?.src.large} alt=""/>
            <div onClick={() => setModal(false)} className={s.close}>close</div>
          </div>
          {/*<p>{item?.title}</p>*/}
          {/*<p>{item?.description}{item?.description}</p>*/}
        </div>
        <div className={s.gallery}>
          {items.map(item => {
            const classname = item.className === 'h_stretch'
              ? s.h_stretch : item.className === 'v_stretch'
                ? s.v_stretch : item.className === 'big' ? s.big : undefined

            return (
              <div className={classname} onClick={() => handleShowImage(item._id)} key={item._id}>
                <img src={item.src.small} alt=""/>
              </div>
            )
          })}

        </div>
      </div>
    </main>
  )
}
