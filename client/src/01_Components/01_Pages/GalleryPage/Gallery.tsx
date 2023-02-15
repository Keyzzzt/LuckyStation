import s from './gallery.module.scss'
import React, { FC, useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { galleryListTC } from '../../../03_Reducers/gallery/galleryReducer'
import { useDispatch } from 'react-redux'
import { CustomInput } from '../../02_Chunks/CustomInput/CustomInput'
import { galleryItemInfoTC } from '../../../03_Reducers/gallery/galleryItemInfoReducer'
import { useTypedSelector } from '../../../05_Types/01_Base'
import $api from '../../../04_Utils/axiosSetup'
import { editGalleryItemTC } from '../../../03_Reducers/gallery/editGalleryItemReducer'
import { parseCreatedUpdated } from '../../../04_Utils/utils'
import Loader from '../../02_Chunks/Loader/Loader'
import { deleteGalleryItemTC } from '../../../03_Reducers/gallery/deleteGalleryItemReducer'
import { addGalleryItemTC } from '../../../03_Reducers/gallery/addGalleryItemReducer'
import { Button } from '../../02_Chunks/Button/Button'

// TODO Close on Esc & click outside
type GalleryProps = {
  isAdmin: boolean
  isAdminPage?: boolean
}
export const Gallery: FC<GalleryProps> = ({ isAdmin, isAdminPage = false }) => {
  const dispatch = useDispatch()
  const { galleryListItems, fail: galleryListItemsFail } = useTypedSelector(state => state.gallery)
  const { itemInfo } = useTypedSelector(state => state.galleryItemInfo)
  const { success: editSuccess, loading: editLoading, fail: editFail } = useTypedSelector(state => state.editGalleryItem)
  const { success: deleteSuccess, loading: deleteLoading, fail: deleteFail } = useTypedSelector(state => state.deleteGalleryItem)
  const { success: addSuccess, loading: addLoading, fail: addFail } = useTypedSelector(state => state.addGalleryItem)
  const [zoomModal, setZoomModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [addModal, setAddModal] = useState(false)
  const [resetIsDirty, setResetIsDirty] = useState(false)


  const [inputError, setInputError] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [className, setClassName] = useState<'h_stretch' | 'v_stretch' | 'big' | 'small'>('small')
  const [image, setImage] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleCloseModal = () => {
    setResetIsDirty(true)
    setEditModal(false)
    setZoomModal(false)
    setAddModal(false)
    setInputError(false)
    setTitle('')
    setDescription('')
    setImage('')
    setClassName('small')
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

  const handleDelete = (itemId: string) => {
    // Ask if OK
    dispatch(deleteGalleryItemTC(itemId))
    handleCloseModal()
  }
  const handleAddImage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title || !description || !image) {
      setInputError(true)
      return
    }
    const newImage = {
      title,
      description,
      src: {
        small: image,
        large: image,
      },
      className,
    }
    dispatch(addGalleryItemTC(newImage))
    handleCloseModal()
  }
  const handleEditImage = (e: FormEvent<HTMLFormElement>, itemId: string) => {
    e.preventDefault()
    if (!title || !description || !image) {
      setInputError(true)
      return
    }
    const updateData = {
      title,
      description,
      className,
      src: {
        small: image,
        large: image,
      },

    }
    dispatch(editGalleryItemTC(updateData, itemId))
    handleCloseModal()
  }
  const handleShowModal = (itemId: string, modal: 'image' | 'edit') => {
    setResetIsDirty(false)
    dispatch(galleryItemInfoTC(itemId))
    if (modal === 'image') {
      setZoomModal(true)
      return
    }
    if (modal === 'edit') {
      setEditModal(true)
    }
  }
  const handleShowAddModal = () => {
    setResetIsDirty(false)
    setAddModal(true)
  }
  // Get gallery items
  useEffect(() => {
    if (!galleryListItems) {
      dispatch(galleryListTC())
    }
  }, [galleryListItems])
  // Get single item
  useEffect(() => {
    if (itemInfo) {
      setTitle(itemInfo.title)
      setDescription(itemInfo.description)
      setClassName(itemInfo.className)
      setImage(itemInfo.src.small)

    }
  }, [itemInfo])
  // On edit success / fail
  useEffect(() => {
    if (editSuccess) {
      // Show OK message
      dispatch(galleryListTC())
      return
    }
    if (editFail) {
      // Show ERROR message
    }
  }, [editSuccess, editFail])
  // On add success / fail
  useEffect(() => {
    if (addSuccess) {
      // Show OK message
      dispatch(galleryListTC())
      return
    }
    if (addFail) {
      // Show ERROR message
    }
  }, [addSuccess, addFail])
  // On delete success / fail
  useEffect(() => {
    if (deleteSuccess) {
      // Show OK message
      dispatch(galleryListTC())
      return
    }
    if (deleteFail) {
      // Show ERROR message
    }
  }, [deleteSuccess, deleteFail])

  return (
    <main className=''>
      <div className={`stationContainer ${s.localContainer}`}>
        {isAdminPage && (isAdmin) ? (
          <div onClick={handleShowAddModal} className={s.addImageButton}>
            <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48">
              <path
                d="M9 42q-1.25 0-2.125-.875T6 39V9q0-1.25.875-2.125T9 6h20.45v3H9v30h30V18.6h3V39q0 1.25-.875 2.125T39 42Zm26-24.9v-4.05h-4.05v-3H35V6h3v4.05h4.05v3H38v4.05ZM12 33.9h24l-7.2-9.6-6.35 8.35-4.7-6.2ZM9 9v30V9Z"/>
            </svg>
            <span>Add new image</span>
          </div>
        ) : (
          <div className={s.addImageLoaderPlaceholder}><Loader/></div>
        )}
        <div className={zoomModal ? `${s.modal} ${s.open}` : s.modal}>
          {itemInfo && <div className={s.modalContent}>
            <div className={s.modalImage}>
              <img src={itemInfo.src.large} alt=""/>
              <div onClick={handleCloseModal} className={s.closeModal}>close</div>
            </div>
            <div className={s.modalImageInfo}>
              <p className={s.imageTitle}> {itemInfo.title}</p>
              <p className={s.imageDescription}>{itemInfo.description}{itemInfo.description}</p>
            </div>
          </div>}
        </div>
        {isAdmin && isAdminPage && itemInfo && <div className={editModal ? `${s.editModal} ${s.open}` : s.editModal}>
          <div onClick={handleCloseModal} className={s.closeModal}>close</div>
          <form className={s.form} onSubmit={(e) => handleEditImage(e, itemInfo._id)}>
            <div className={s.titleDescription}>
              <CustomInput
                resetIsDirty={resetIsDirty}
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
                resetIsDirty={resetIsDirty}
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
            </div>
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
            <div className={s.addImage}>
              <div>
                <CustomInput
                  resetIsDirty={resetIsDirty}
                  id={'imageTile'}
                  label='You can enter image url here'
                  returnValue={setImage}
                  setInputError={setInputError}
                  inputError={inputError}
                  type="text"
                  placeholder="Enter image url"
                  name="image"
                  value={image}
                />
              </div>
              <div>
                <input
                  className='stationInput'
                  type="file"
                  accept='image/*, .png, .jpg, .gif, .web'
                  // multiple
                  id="image-file"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
            <div className={s.addedUpdated}>
              <p>Added: {parseCreatedUpdated(itemInfo.createdAt, 'date')}</p>
              {itemInfo.updatedAt === itemInfo.createdAt ? null :
                <p>Updated: {parseCreatedUpdated(itemInfo.updatedAt, 'date')}</p>}
            </div>
            <div className={s.buttons}>
              <Button title='Submit' type='submit' color='success' marginTop='20px'/>
              <Button title='Delete' type='button' color='danger' marginTop='20px'
                      onClick={() => handleDelete(itemInfo._id)}/>
            </div>
          </form>
        </div>}
        {isAdmin && isAdminPage && <div className={addModal ? `${s.editModal} ${s.open}` : s.editModal}>
          <div onClick={handleCloseModal} className={s.closeModal}>close</div>
          <form className={s.form} onSubmit={handleAddImage}>
            <div className={s.titleDescription}>
              <CustomInput
                resetIsDirty={resetIsDirty}
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
                resetIsDirty={resetIsDirty}
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
            </div>
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
            <div>
              <div>
                <CustomInput
                  resetIsDirty={resetIsDirty}
                  id={'imageTile'}
                  label='You can enter image url here'
                  returnValue={setImage}
                  setInputError={setInputError}
                  inputError={inputError}
                  type="text"
                  placeholder="Enter image url"
                  name="image"
                  value={image}
                />
              </div>
              <div>
                <label htmlFor="addGalleryImage">Or you can upload image from your PC</label>
                <input
                  className='stationInput'
                  type="file"
                  accept='image/*, .png, .jpg, .gif, .web'
                  // multiple
                  id="addGalleryImage"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
            <Button title='Add' type='submit' color='success' marginTop='20px'/>
          </form>
        </div>}
        <div className={s.gallery}>

          {galleryListItems && galleryListItems.length === 0 && <span>Gallery is empty, please add new images.</span>}
          {!galleryListItems && !galleryListItemsFail && <Loader/>}
          {!galleryListItems && galleryListItemsFail && <span>{galleryListItemsFail}</span>}
          {galleryListItems && galleryListItems.map(item => {
            const classname = item.className === 'h_stretch'
              ? s.h_stretch : item.className === 'v_stretch'
                ? s.v_stretch : item.className === 'big' ? s.big : s.small

            return (
              <div className={classname} key={item._id}>
                <img onClick={() => handleShowModal(item._id, 'image')} src={item.src.small} alt=""/>
                {isAdmin && isAdminPage && (
                  <div className={s.editIcon}>
                    <svg onClick={() => handleShowModal(item._id, 'edit')} xmlns="http://www.w3.org/2000/svg"
                         height="48" width="48">
                      <path
                        d="M9 39h2.2l22.15-22.15-2.2-2.2L9 36.8Zm30.7-24.3-6.4-6.4 2.1-2.1q.85-.85 2.1-.85t2.1.85l2.2 2.2q.85.85.85 2.1t-.85 2.1Zm-2.1 2.1L12.4 42H6v-6.4l25.2-25.2Zm-5.35-1.05-1.1-1.1 2.2 2.2Z"/>
                    </svg>
                  </div>
                )}
              </div>

            )
          })}
        </div>
      </div>
    </main>
  )
}
