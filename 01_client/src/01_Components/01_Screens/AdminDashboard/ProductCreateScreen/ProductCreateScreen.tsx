import { FC, useEffect, useState } from 'react'
import styles from './ProductCreateScreen.module.scss'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import Loader from '../../../02_Chunks/Loader/Loader'
// import { ErrorMessage } from '../../../02_Chunks/ErrorMessage/ErrorMessage'
import { useScrollToTop } from '../../../../04_Utils/hooks'
import { createProductThunk } from '../../../../03_Reducers/admin/createProductReducer'
import $api from '../../../../04_Utils/axiosSetup'

export const ProductCreateScreen: FC = () => {
  useScrollToTop()
  const dispatch = useDispatch()
  const history = useHistory()
  const { userInfo } = useTypedSelector((state) => state.userInfo)

  const [brand, setBrand] = useState('Phillips')
  const [name, setName] = useState('Fidelio')
  const [category, setCategory] = useState('Audio')
  const [description, setDescription] = useState(
    'What if you could always be in the perfect place to listen to the music you love? Exquisitely tuned drivers, excellent Active Noise Cancelling and the right fit combine to create the perfect listening environment. Wherever you are. See all benefits'
  )
  const [price, setPrice] = useState('99')
  const [image, setImage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [countInStock, setCountInStock] = useState('10')
  const [colors, setColors] = useState('')
  const [sizes, setSizes] = useState('')
  const [isNew, setIsNew] = useState(false)

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

  const saveToLocalStorage = () => {
    // TODO
  }

  const uploadImageHandler = async (e: any) => {
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
      const { data } = await $api.post('http://localhost:5000/api/upload', formData, config)
      setImage(data)
      setUploading(false)
    } catch (error) {
      console.log(error)
      setUploading(false)
    }
  }

  const returnHandler = () => {
    history.push('/dashboard')
  }

  const stringToArray = (str: string) => {
    if (str.length === 0) return []
    return str
      .trim()
      .split(',')
      .map((item) => item.trim())
  }

  const submitHandler = (e: any) => {
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
        isNew,
      })
    )
  }

  useEffect(() => {
    if (!userInfo) {
      history.push('/login?redirect=dashboard')
    }
    if (userInfo && !userInfo.isAdmin) {
      history.push('/')
    }
  }, [history, userInfo])

  return (
    <div className={styles.container}>
      <button onClick={returnHandler}>Back</button>
      <button onClick={clearHandler}>Clear</button>
      <button onClick={saveToLocalStorage}>Save locally</button>

      <form onSubmit={submitHandler}>
        <input onChange={(e) => setBrand(e.target.value)} type="text" value={brand} placeholder="Brand" />
        <input onChange={(e) => setName(e.target.value)} type="text" value={name} placeholder="Name" />
        <input onChange={(e) => setCategory(e.target.value)} type="text" value={category} placeholder="Category" />
        <input onChange={(e) => setDescription(e.target.value)} type="text" value={description} placeholder="Description" />
        <input onChange={(e) => setPrice(e.target.value)} type="text" value={price} placeholder="Price" />
        <input onChange={(e) => setCountInStock(e.target.value)} type="text" value={countInStock} placeholder="Count in stock" />
        <input onChange={(e) => setImage(e.target.value)} type="text" value={image} placeholder="Image" />
        <label htmlFor="image-file">Choose image</label>
        <input onChange={uploadImageHandler} type="file" id="image-file" />
        {uploading && <Loader />}
        <input onChange={(e) => setColors(e.target.value)} type="text" value={colors} placeholder="Colors in #xxxxxx format" />
        <input onChange={(e) => setSizes(e.target.value)} type="text" value={sizes} placeholder="Sizes" />
        <label htmlFor="isNew">New product</label>
        <input onChange={(e) => setIsNew((prev) => !prev)} type="checkbox" id="isNew" />
        <input type="submit" value="Create" />
      </form>
    </div>
  )
}
