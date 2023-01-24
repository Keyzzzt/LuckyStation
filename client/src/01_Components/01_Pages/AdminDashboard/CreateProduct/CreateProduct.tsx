import React, { FC, FormEvent, useEffect, useRef, useState } from 'react'
import s from './createProduct.module.scss'
import globalStyles from './../../../../02_Styles/global.module.scss'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import Loader from '../../../02_Chunks/Loader/Loader'
import { useScrollToTop } from '../../../../04_Utils/hooks'
import { createProductThunk } from '../../../../03_Reducers/admin/createProductReducer'
import { actions } from '../../../../03_Reducers/admin/createProductReducer'
import $api from '../../../../04_Utils/axiosSetup'

// TODO
// Display images when selected

// TODO
// Add modal window
// OK ? send to main admin page
// Add new product - stay on Create product



// TODO
// Polish styles

export const CreateProduct: FC = () => {
  const history = useHistory()
  const { success } = useTypedSelector(state => state.createProduct)
  useScrollToTop()
  const dispatch = useDispatch()

  const [brand, setBrand] = useState('Phillips')
  const [name, setName] = useState('Fidelity')
  const [category, setCategory] = useState('Audio')
  const [description, setDescription] = useState(
    'What if you could always be in the perfect place to listen to the music you love? ',
  )
  const [price, setPrice] = useState('99')
  const [uploading, setUploading] = useState(false)
  const [countInStock, setCountInStock] = useState('10')
  const [colors, setColors] = useState('')
  const [sizes, setSizes] = useState('')
  const [isNewProduct, setIsNewProduct] = useState(false)

  const [image, setImage] = useState('')
  const [uploadedFile, setUploadedFile] = useState({ fileName: '', filePath: '' })

  const fileInputRef = useRef(null)

  // todo uploadProgress теперь можно использовать для создания лоадера с % подгрузки
  // const [uploadProgress, setUploadProgress] = useState(0)

  const clearHandler = () => {
    setName('')
    setBrand('')
    setCategory('')
    setDescription('')
    setPrice('')
    setImage('')
    setCountInStock('')
    setColors('')
    setSizes('')
  }

  const handleUpload = async (e: any) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    setUploading(true)
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // onUploadProgress: (progress: any) => {
        //   const { loaded, total } = progress
        //   // @ts-ignore
        //   setUploadProgress(parseInt(Math.round((loaded * 100) / total)))
        //   setTimeout(() => setUploadProgress(0), 1000)
        // },
      }
      const { data } = await $api.post('http://localhost:5000/api/upload', formData, config)
      const { fileName, filePath } = data
      setImage(filePath)
      setUploadedFile({ fileName, filePath })
      setUploading(false)
    } catch (error) {
      setUploading(false)
    }
  }

  const stringToArray = (str: string) => {
    if (str.length === 0) return []
    return str
      .trim()
      .split(',')
      .map(item => item.trim())
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(
      createProductThunk({
        name,
        brand,
        category,
        description,
        price: Number(price),
        image,
        countInStock,
        colors: stringToArray(colors),
        sizes: stringToArray(sizes),
        isNewProduct,
      }),
    )
  }

  const handleFilePick = () => {
    // @ts-ignore
    fileInputRef.current.click()
  }

  useEffect(() => {
    if (!success) {
      return
    }
    history.push('/dashboard')
    dispatch(actions.reset())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success])

  return (
    <div className={s.createProduct}>
      {uploading && <Loader/>}
      <form onSubmit={handleSubmit} className={s.form}>
        <div className={s.formItem}>
          <label htmlFor="brandName">Brand name</label>
          <input onChange={e => setBrand(e.target.value)} type="text" value={brand} placeholder="Brand" id='brandName'/>
        </div>
        <div className={s.formItem}>
          <label htmlFor="productName">Product name</label>
          <input onChange={e => setName(e.target.value)} type="text" value={name} placeholder="Name" id='productName'/>
        </div>
        <div className={s.formItem}>
          <label htmlFor="productCategory">Product category</label>
          <input onChange={e => setCategory(e.target.value)} type="text" value={category} placeholder="Category"
                 id='productCategory'/>
        </div>
        <div className={s.formItem}>
          <label htmlFor="productDescription">Product description</label>
          <input
            onChange={e => setDescription(e.target.value)}
            type="text"
            value={description}
            placeholder="Description"
            id='productDescription'
          />
        </div>
        <div className={s.formItem}>
          <label htmlFor="productPrice">Product price</label>
          <input onChange={e => setPrice(e.target.value)} type="text" value={price} placeholder="Price"
                 id='productPrice'/>
        </div>
        <div className={s.formItem}>
          <label htmlFor="countInStock">Count in stock</label>
          <input
            onChange={e => setCountInStock(e.target.value)}
            type="text"
            value={countInStock}
            placeholder="Count in stock"
            id='countInStock'
          />
        </div>


        <div className={s.formItem}>
          <label htmlFor="countInStock">Image</label>
          <input onChange={e => setImage(e.target.value)} type="text" value={image} placeholder="Image"/>
          <button onClick={handleFilePick} className={s.uploadImageButton}>Choose file</button>
          <input
            className={globalStyles.hidden}
            ref={fileInputRef}
            onChange={handleUpload}
            type="file"
            accept='image/*, .png, .jpg, .gif, .web'
            // multiple
            id="image-file"
          />
        </div>
        <div className={s.formItem}>
          <label htmlFor="productColors">Colors</label>
          <input
            onChange={e => setColors(e.target.value)}
            type="text"
            value={colors}
            placeholder="Colors in #xxxxxx format"
            id='productColors'
          />
        </div>

        <div className={s.formItem}>
          <label htmlFor="productSizes">Product sizes</label>
          <input onChange={e => setSizes(e.target.value)} type="text" value={sizes} placeholder="Sizes"
                 id='productSizes'/>
        </div>

        <div className={s.formItem}>
          <label htmlFor="isNewProduct">New product</label>
          <input onChange={e => setIsNewProduct(prev => !prev)} type="checkbox" id="isNewProduct"/>
        </div>

        <div className={s.formItem}>
          <input type='button' onClick={clearHandler} value='Clear form' />
          <input type="submit" value="Create"/>
        </div>
      </form>
      <div className={s.uploadedImage}>
        {uploadedFile.filePath ? (
          <>
            <div>{uploadedFile.fileName}</div>
            <img src={uploadedFile.filePath} alt="img"/>
          </>
        ) : (
          <div>No image uploaded</div>
        )}
      </div>
    </div>
  )
}
