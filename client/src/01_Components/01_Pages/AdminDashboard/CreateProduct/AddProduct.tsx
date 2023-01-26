import React, { FC, useEffect, useRef, useState } from 'react'
import s from './addProduct.module.scss'
import globalStyles from './../../../../02_Styles/global.module.scss'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { useNavigate } from 'react-router-dom'
import { useScrollToTop } from '../../../../04_Utils/hooks'
import Loader from '../../../02_Chunks/Loader/Loader'
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

export const AddProduct: FC = () => {
  const { success } = useTypedSelector(state => state.createProduct)
  useScrollToTop()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [countInStock, setCountInStock] = useState('')
  const [colors, setColors] = useState('')
  const [sizes, setSizes] = useState('')
  const [image, setImage] = useState('')
  const [uploadedFile, setUploadedFile] = useState({ fileName: '', filePath: '' })
  const [isNewProduct, setIsNewProduct] = useState(false)
  const [uploading, setUploading] = useState(false)


  const fileInputRef = useRef(null)

  const handleClear = () => {
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

  const handleCreate = () => {

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

  // If product created, redirect to dashboard
  useEffect(() => {
    if (!success) {
      return
    }
    navigate('/dashboard')
    dispatch(actions.reset())
  }, [success])

  return (
    <div className={s.container}>
      {uploading && <Loader/>}
      <table className={globalStyles.table}>
        <thead>
        <tr>
          <th>
            <div>Field</div>
          </th>
          <th>
            <div>Value</div>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>Name</td>
          <td><input type="text" value={name} onChange={(e) => setName(e.target.value)}/></td>
        </tr>
        <tr>
          <td>Brand</td>
          <td><input type="text" value={brand} onChange={(e) => setBrand(e.target.value)}/>
          </td>
        </tr>
        <tr>
          <td>Category</td>
          <td><input type="text" value={category} onChange={(e) => setCategory(e.target.value)}/>
          </td>
        </tr>
        <tr>
          <td>Description</td>
          <td><textarea value={description} onChange={(e) => setDescription(e.target.value)}/></td>
        </tr>
        <tr>
          <td>Price</td>
          <td><input type="text" value={price} onChange={(e) => setPrice(e.target.value)}/></td>
        </tr>
        <tr>
          <td>In stock</td>
          <td><input type="text" value={countInStock} onChange={(e) => setCountInStock(e.target.value)}/></td>
        </tr>
        <tr>
          <td>Colors</td>
          <td><input type="text" value={colors} onChange={(e) => setColors(e.target.value)}/></td>
        </tr>
        <tr>
          <td>Sizes</td>
          <td><input type="text" value={sizes} onChange={(e) => setSizes(e.target.value)}/></td>
        </tr>
        <tr>
          <td>Mark as new</td>
          <td><input onChange={e => setIsNewProduct(prev => !prev)} type="checkbox"/></td>
        </tr>
        <tr>
          <td>Images</td>
          <td>
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
          </td>
        </tr>


        </tbody>
      </table>
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
      <div className={s.buttons}>
        <input type='button' onClick={handleClear} value='Clear form'/>
        <input type='button' onClick={handleCreate} value='Create'/>
      </div>
    </div>
  )
}
