import s from './gallery.module.scss'
import React, { FC, useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { GalleryListItemType } from '../../../03_Reducers/gallery/galleryReducer'
import { useDispatch } from 'react-redux'
import { CustomInput } from '../../02_Chunks/CustomInput/CustomInput'
import { galleryItemInfoThunk } from '../../../03_Reducers/gallery/galleryItemInfoReducer'
import { useTypedSelector } from '../../../05_Types/01_Base'
import $api from '../../../04_Utils/axiosSetup'
import { editGalleryItemThunk } from '../../../03_Reducers/gallery/editGalleryItemReducer'

// TODO Close on Esc & click outside
type GalleryProps = {
  items: GalleryListItemType[]
  item?: GalleryListItemType | null
  isAdmin: boolean
  isAdminPage?: boolean
}
export const Gallery: FC<GalleryProps> = ({ items, item, isAdmin, isAdminPage = false }) => {
  const dispatch = useDispatch()
  const { itemInfo } = useTypedSelector(state => state.galleryItemInfo)
  const [modal, setModal] = useState(false)
  const [editModal, setEditModal] = useState(false)

  const [inputError, setInputError] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [className, setClassName] = useState<'h_stretch' | 'v_stretch' | 'big' | 'small'>('small')
  const [image, setImage] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleShowModal = (itemId: string, action: 'image' | 'edit') => {
    dispatch(galleryItemInfoThunk(itemId))
    if (action === 'image') {
      setModal(true)
      setEditModal(false)
      return
    }
    if (action === 'edit') {
      setEditModal(true)
    }
  }
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target && e.target.files) {
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('image', file)
      setUploading(true)
      try {
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
        const { data } = await $api.post('upload', formData, config)
        setImage(data)
        setUploading(false)
      } catch (e) {
        console.log(e)
        setUploading(false)
      }
    }
  }
  const handleSubmit = (e: FormEvent<HTMLFormElement>, itemId: string) => {
    e.preventDefault()
    const updateData = {
      title,
      description,
      className,
      src: {
        small: image,
        large: image
      }
    }
    dispatch(editGalleryItemThunk(updateData, itemId))
  }


  useEffect(() => {
    if (itemInfo) {
      setTitle(itemInfo.title)
      setDescription(itemInfo.description)
      setClassName(itemInfo.className)
    }
  }, [itemInfo])
  return (
    <main className='stationSectionMain'>
      <div className={`stationContainer ${s.localContainer}`}>
        <div className={modal ? `${s.modal} ${s.open}` : s.modal}>
          <div className={s.imageWrapper}>
            <img src={itemInfo?.src.large} alt=""/>
            <div onClick={() => setModal(false)} className={s.closeImage}>close</div>
          </div>
          {/*<p>{item?.title}</p>*/}
          {/*<p>{item?.description}{item?.description}</p>*/}
        </div>
        {isAdmin && isAdminPage && itemInfo && <div className={editModal ? `${s.editModal} ${s.open}` : s.editModal}>
          <form className={s.form} onSubmit={(e) => handleSubmit(e, itemInfo._id)}>
            <div onClick={() => setEditModal(false)} className={s.closeEdit}>close</div>
            <CustomInput
              id={'imageTile'}
              label='Title'
              returnValue={setTitle}
              setInputError={setInputError}
              inputError={inputError}
              type="text"
              placeholder="Enter title"
              name="title"
              value={title}
            />
            <CustomInput
              id={'imageDescription'}
              label='Image description'
              returnValue={setDescription}
              setInputError={setInputError}
              inputError={inputError}
              type="text"
              placeholder="Enter description"
              name="description"
              value={description}
            />
            <fieldset className={s.radioWrapper}>
              <legend>Select size of image:</legend>
              <div className={s.radioItem}>
                <input onChange={() => setClassName('small')} type="radio" id="smallGalleryImage" name='imageSize'
                       value="small" checked={className === 'small'}/>
                <label htmlFor="smallGalleryImage">Small</label>
              </div>

              <div className={s.radioItem}>
                <input onChange={() => setClassName('big')} type="radio" id="bigGalleryImage" name='imageSize'
                       value='big' checked={className === 'big'}/>
                <label htmlFor="bigGalleryImage">Big</label>
              </div>

              <div className={s.radioItem}>
                <input onChange={() => setClassName('v_stretch')} type="radio" id="verticalGalleryImage"
                       name='imageSize' value="v_stretch" checked={className === 'v_stretch'}/>
                <label htmlFor="verticalGalleryImage">Vertical</label>
              </div>
              <div className={s.radioItem}>
                <input onChange={() => setClassName('h_stretch')} type="radio" id="horizontalGalleryImage"
                       name='imageSize' value="h_stretch" checked={className === 'h_stretch'}/>
                <label htmlFor="horizontalGalleryImage">Horizontal</label>
              </div>
            </fieldset>
            <label htmlFor="imageUrl">Image</label>
            <input id='imageUrl' onChange={(e) => setImage(e.target.value)} type="text" placeholder='Enter image url'
                   value={image}/>
            <label htmlFor="image-file">Choose File</label>
            <input
              className={s.file}
              type="file"
              accept='image/*, .png, .jpg, .gif, .web'
              // multiple
              id="image-file"
              onChange={handleFileUpload}
            />


            <p>Created: {itemInfo?.createdAt}</p>
            {itemInfo?.updatedAt === itemInfo?.createdAt ? null : <p>Updated: {item?.updatedAt}</p>}
            <div className={s.buttons}>
              <input className='stationSubmitBtn' type="submit" value='Submit'/>
              <input className='stationDangerBtn' type="button" value='Delete'/>
            </div>
          </form>
        </div>}
        <div className={s.gallery}>
          {items.map(item => {
            const classname = item.className === 'h_stretch'
              ? s.h_stretch : item.className === 'v_stretch'
                ? s.v_stretch : item.className === 'big' ? s.big : s.small

            return (
              <>
                {isAdmin ? (
                  <div className={classname} key={item._id}>
                    {}
                    <img src={item.src.small} alt=""/>
                    {isAdmin && isAdminPage && (
                      <div className={s.editIcons}>
                        <svg onClick={() => handleShowModal(item._id, 'image')} xmlns="http://www.w3.org/2000/svg"
                             height="48"
                             width="48">
                          <path
                            d="M39.8 41.95 26.65 28.8q-1.5 1.3-3.5 2.025-2 .725-4.25.725-5.4 0-9.15-3.75T6 18.75q0-5.3 3.75-9.05 3.75-3.75 9.1-3.75 5.3 0 9.025 3.75 3.725 3.75 3.725 9.05 0 2.15-.7 4.15-.7 2-2.1 3.75L42 39.75Zm-20.95-13.4q4.05 0 6.9-2.875Q28.6 22.8 28.6 18.75t-2.85-6.925Q22.9 8.95 18.85 8.95q-4.1 0-6.975 2.875T9 18.75q0 4.05 2.875 6.925t6.975 2.875ZM17.3 24.3v-4.1h-4.1v-3h4.1v-4.05h3v4.05h4.05v3H20.3v4.1Z"/>
                        </svg>
                        <svg onClick={() => handleShowModal(item._id, 'edit')} xmlns="http://www.w3.org/2000/svg"
                             height="48" width="48">
                          <path
                            d="M9 39h2.2l22.15-22.15-2.2-2.2L9 36.8Zm30.7-24.3-6.4-6.4 2.1-2.1q.85-.85 2.1-.85t2.1.85l2.2 2.2q.85.85.85 2.1t-.85 2.1Zm-2.1 2.1L12.4 42H6v-6.4l25.2-25.2Zm-5.35-1.05-1.1-1.1 2.2 2.2Z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                ) : (
                  <div onClick={() => handleShowModal(item._id, 'image')} className={classname} key={item._id}>
                    <img src={item.src.small} alt=""/>
                  </div>
                )}
              </>

            )
          })}

        </div>
      </div>
    </main>
  )
}
