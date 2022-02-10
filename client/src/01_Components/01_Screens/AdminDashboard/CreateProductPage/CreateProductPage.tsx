import styles from './CreateProductPage.module.scss'
import { FC, FormEvent, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import Loader from '../../../02_Chunks/Loader/Loader'
import { useScrollToTop } from '../../../../04_Utils/hooks'
import { createProductThunk } from '../../../../03_Reducers/admin/createProductReducer'
import $api from '../../../../04_Utils/axiosSetup'
import { RedirectButton } from '../../../02_Chunks/BackButton/BackButton'
import { actions } from '../../../../03_Reducers/admin/createProductReducer'

export const CreateProductPage: FC = () => {
  const history = useHistory()
  const { success, loading, fail } = useTypedSelector((state) => state.createProduct)

  useScrollToTop()
  const dispatch = useDispatch()

  const [brand, setBrand] = useState('Phillips')
  const [name, setName] = useState('Fidelity')
  const [category, setCategory] = useState('Audio')
  const [description, setDescription] = useState('What if you could always be in the perfect place to listen to the music you love? ')
  const [price, setPrice] = useState('99')
  const [uploading, setUploading] = useState(false)
  const [countInStock, setCountInStock] = useState('10')
  const [colors, setColors] = useState('')
  const [sizes, setSizes] = useState('')
  const [isNewProduct, setIsNewProduct] = useState(false)

  const [image, setImage] = useState('')
  const [uploadedFile, setUploadedFile] = useState({ fileName: '', filePath: '' })
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

  const uploadImageHandler = async (e: any) => {
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
      .map((item) => item.trim())
  }

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
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
      })
    )
  }

  useEffect(() => {
    if (!success) {
      return
    }
    history.push('/dashboard')
    dispatch(actions.reset())
  }, [success])

  return (
    <div className={styles.container}>
      <RedirectButton path="/dashboard">Back</RedirectButton>
      <button onClick={clearHandler}>Clear</button>
      <form onSubmit={submitHandler}>
        <input onChange={(e) => setBrand(e.target.value)} type="text" value={brand} placeholder="Brand" />
        <input onChange={(e) => setName(e.target.value)} type="text" value={name} placeholder="Name" />
        <input onChange={(e) => setCategory(e.target.value)} type="text" value={category} placeholder="Category" />
        <input onChange={(e) => setDescription(e.target.value)} type="text" value={description} placeholder="Description" />
        <input onChange={(e) => setPrice(e.target.value)} type="text" value={price} placeholder="Price" />
        <input onChange={(e) => setCountInStock(e.target.value)} type="text" value={countInStock} placeholder="Count in stock" />
        <input onChange={(e) => setImage(e.target.value)} type="text" value={image} placeholder="Image" />
        <input onChange={uploadImageHandler} type="file" id="image-file" />
        {uploading && <Loader />}
        <input onChange={(e) => setColors(e.target.value)} type="text" value={colors} placeholder="Colors in #xxxxxx format" />
        <input onChange={(e) => setSizes(e.target.value)} type="text" value={sizes} placeholder="Sizes" />
        <label htmlFor="isNew">New product</label>
        <input onChange={(e) => setIsNewProduct((prev) => !prev)} type="checkbox" id="isNew" />
        <input type="submit" value="Create" />
      </form>
      {uploadedFile.filePath ? (
        <div>
          <div>{uploadedFile.fileName}</div>
          <img src={uploadedFile.filePath} alt="product" />
        </div>
      ) : (
        <div>No image uploaded</div>
      )}
    </div>
  )
}
