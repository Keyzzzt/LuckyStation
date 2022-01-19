import styles from './ProductEditScreen.module.scss'
import { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import { Link, useHistory } from 'react-router-dom'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { useScrollToTop } from '../../../../04_Utils/hooks'
import { productInfoThunk } from '../../../../03_Reducers/product/productInfoReducer'
import { productDeleteThunk } from '../../../../03_Reducers/admin/productDeleteReducer'
import { updateProductThunk } from '../../../../03_Reducers/admin/updateProductReducer'
import { RedirectButton } from '../../../02_Chunks/BackButton/BackButton'

export const ProductEditScreen: FC = () => {
  const history = useHistory()

  useScrollToTop()
  const dispatch = useDispatch()
  const { productId } = useParams<{ productId: string }>()
  const { productInfo, fail, loading } = useTypedSelector((state) => state.productInfo)
  const { loading: loadingUpdate } = useTypedSelector((state) => state.updateProduct)

  const [name, setName] = useState(productInfo?.name)
  const [brand, setBrand] = useState(productInfo?.brand)
  const [category, setCategory] = useState(productInfo?.category)
  const [description, setDescription] = useState(productInfo?.description)
  const [price, setPrice] = useState(productInfo?.price)
  const [countInStock, setCountInStock] = useState(productInfo?.countInStock)

  const deleteHandler = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      dispatch(productDeleteThunk(id))
      alert(`${name} has been removed`)
      history.push('/dashboard')
    }
    return
  }
  const updateHandler = () => {
    dispatch(
      updateProductThunk(productInfo?._id!, {
        name,
        brand,
        description,
        category,
        countInStock,
        price,
        image: 'https://www.usa.philips.com/c-dam/b2c/category-pages/sound-and-vision/fidelio/master/homepage/l3-hero-image.png',
        isNewProduct: true,
      })
    )
  }
  useEffect(() => {
    dispatch(productInfoThunk(productId))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])
  useEffect(() => {
    setName(productInfo?.name)
    setBrand(productInfo?.brand)
    setDescription(productInfo?.description)
    setCategory(productInfo?.category)
    setPrice(productInfo?.price)
    setCountInStock(productInfo?.countInStock)
  }, [productInfo])

  return (
    <div className={styles.container}>
      <RedirectButton path="/dashboard">Back</RedirectButton>
      <button onClick={updateHandler}>Update</button>
      <button onClick={() => deleteHandler(productId, productInfo?.name!)}>Delete</button>
      <div>
        <label htmlFor="edit-name">Product name</label>
        <input onChange={(e) => setName(e.target.value)} type="text" value={name} id="edit-name" />
      </div>
      <div>
        <label htmlFor="edit-brand">Product brand</label>
        <input onChange={(e) => setBrand(e.target.value)} type="text" value={brand} id="edit-brand" />
      </div>
      <div>
        <label htmlFor="edit-category">Category</label>
        <input onChange={(e) => setCategory(e.target.value)} type="text" value={category} id="edit-category" />
      </div>
      <div>
        <label htmlFor="edit-description">Description</label>
        <input onChange={(e) => setDescription(e.target.value)} type="text" value={description} id="edit-description" />
      </div>
      <div>
        <label htmlFor="edit-price">Price</label>
        <input onChange={(e) => setPrice(Number(e.target.value))} type="text" value={price} id="edit-price" />
      </div>
      <div>
        <label htmlFor="edit-stock">Count in stock</label>
        <input onChange={(e) => setCountInStock(Number(e.target.value))} type="text" value={countInStock} id="edit-stock" />
      </div>

      <Link to={`/user/${productInfo?.user}/edit`}>User added this product - {productInfo?.user}</Link>

      <div>Rating: {productInfo?.rating}</div>
      <div>Count in favorites: {productInfo?.countInFavorite}</div>
      {productInfo?.isNewProduct ? <div>Labeled as NEW</div> : <div>Not labeled as NEW</div>}
      <div>Count viewed: {productInfo?.countViewed}</div>
      <div>
        <div>Number of Reviews: {productInfo?.numReviews}</div>
        <div>Read Reviews</div>
      </div>
      <div>Created at: {productInfo?.createdAt}</div>
      <div>Updated at: {productInfo?.updatedAt}</div>
      <div>
        <img src={productInfo?.image} alt="Logo" />
      </div>
    </div>
  )
}
