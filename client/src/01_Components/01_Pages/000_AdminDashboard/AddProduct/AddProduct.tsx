import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import s from './addProduct.module.scss'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { useNavigate } from 'react-router-dom'
import { useScrollToTop } from '../../../../04_Utils/hooks'
import Loader from '../../../02_Chunks/Loader/Loader'
import { createProductTC } from '../../../../03_Reducers/admin/createProductReducer'
import $api from '../../../../04_Utils/axiosSetup'
import { BreadCrumbs } from '../../../02_Chunks/Breadcrumbs/Breadcrumbs'
import { Button } from '../../../02_Chunks/Button/Button'

// TODO
// Display images when selected

// TODO
// Add modal window
// OK ? send to main admin page
// Add new product - stay on Create product


export type NewProductType = {
  name: string
  price: number
  images: string[]
  brand: string
  category: string
  countInStock: number
  description: string
  description2: string
  includes: string
  maximumLoadCapacity: string
  weight: string
  size: string[]
  colors: string[]
  colorsInText: string
  materials: string
  careInstructions: string
  additionalInfo: string
  whatShouldYouKnow: string
  quality: string
  isNewProduct: boolean
  isPromo: boolean
  isShowOnMainPage: boolean
}

// TODO Replace useState with useReducer
export const AddProduct: FC = () => {
  const { success } = useTypedSelector(state => state.createProduct)
  useScrollToTop()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [name, setName] = useState<string>('')
  const [brand, setBrand] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [price, setPrice] = useState<number>(0)
  const [countInStock, setCountInStock] = useState<number>(0)
  const [colors, setColors] = useState<string>('')
  const [size, setSize] = useState<string>('')
  const [images, setImages] = useState<string[]>([])
  const [uploadedFile, setUploadedFile] = useState({ fileName: '', filePath: '' })
  const [isNewProduct, setIsNewProduct] = useState(false)
  const [uploading, setUploading] = useState(false)


  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData()
    if (e.target.files) {
      const file = e.target.files[0]
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

        setImages([filePath])
        setUploadedFile({ fileName, filePath })
        setUploading(false)
      } catch (error) {
        setUploading(false)
      }
    }

  }

  const stringToArray = (str: string): string[] => {
    if (str.length === 0) return []
    return str
      .trim()
      .split(',')
      .map(item => item.trim())
  }

  const handleSubmit = () => {
    dispatch(
      createProductTC({
        name,
        brand,
        category,
        description,
        price: Number(price),
        images,
        countInStock,
        colors: stringToArray(colors),
        size: stringToArray(size),
        isNewProduct,
      }),
    )
  }
  // If product created, redirect to dashboard
  useEffect(() => {
    if (!success) {
      return
    }
    navigate('/dashboard')
  }, [success])

  return (
    <div className={s.container}>
      {uploading && <Loader/>}
      <BreadCrumbs pageTitle='New Product' breadcrumbs={['dashboard', 'products', 'add new product']}/>
      <form onSubmit={handleSubmit}>
        <table className='stationTable'>
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
            <td><input className='stationTableInput' type="text" value={name}
                       onChange={(e) => setName(e.target.value)}/></td>
          </tr>
          <tr>
            <td>Brand</td>
            <td><input className='stationTableInput' type="text" value={brand}
                       onChange={(e) => setBrand(e.target.value)}/>
            </td>
          </tr>
          <tr>
            <td>Category</td>
            <td><input className='stationTableInput' type="text" value={category}
                       onChange={(e) => setCategory(e.target.value)}/>
            </td>
          </tr>
          <tr>
            <td>Description</td>
            <td><textarea className='stationTableInput' value={description}
                          onChange={(e) => setDescription(e.target.value)}/></td>
          </tr>
          <tr>
            <td>Price</td>
            <td><input className='stationTableInput' type="text" value={price}
                       onChange={(e) => setPrice(+e.target.value)}/></td>
          </tr>
          <tr>
            <td>In stock</td>
            <td><input className='stationTableInput' type="text" value={countInStock}
                       onChange={(e) => setCountInStock(+e.target.value)}/></td>
          </tr>
          <tr>
            <td>Colors</td>
            <td><input className='stationTableInput' type="text" value={colors}
                       onChange={(e) => setColors(e.target.value)}/></td>
          </tr>
          <tr>
            <td>Sizes</td>
            <td><input className='stationTableInput' type="text" value={size}
                       onChange={(e) => setSize(e.target.value)}/></td>
          </tr>
          <tr>
            <td>Mark as new</td>
            <td><input className='stationTableInput' onChange={e => setIsNewProduct(prev => !prev)} type="checkbox"/>
            </td>
          </tr>
          <tr>
            <td>Images</td>
            <td>
              <input onChange={e => setImages([e.target.value])} type="text" value={images} placeholder="Image"/>
              <input
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
        <Button title='Create' type='submit' color='success' marginTop='0'/>
      </form>
    </div>
  )
}
