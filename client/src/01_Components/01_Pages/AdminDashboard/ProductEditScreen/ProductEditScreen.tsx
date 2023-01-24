import { FC, useEffect, useState } from 'react'
import s from './productEditScreen.module.scss'
import globalStyles from './../../../../02_Styles/global.module.scss'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { useScrollToTop } from '../../../../04_Utils/hooks'
import { productInfoThunk } from '../../../../03_Reducers/product/productInfoReducer'
import { productDeleteThunk } from '../../../../03_Reducers/admin/productDeleteReducer'
import { updateProductThunk } from '../../../../03_Reducers/admin/updateProductReducer'
import Loader from '../../../02_Chunks/Loader/Loader'
import { EditableSpan } from '../../../02_Chunks/EditableSpan/EditableSpan'
import { getUserThunk } from '../../../../03_Reducers/admin/getUserReducer'
import { PageType } from '../AdminDashboard'

type Props = {
  productId: string
  setPage: (value: PageType) => void
  setUserId: (userId: string) => void
  }
export const ProductEditScreen: FC<Props> = ({ productId, setUserId, setPage }) => {
  const history = useHistory()
  useScrollToTop()
  const dispatch = useDispatch()
  const { productInfo } = useTypedSelector(state => state.productInfo)
  const { user } = useTypedSelector(state => state.getUser)

  const [userName, setUserName] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [brand, setBrand] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [price, setPrice] = useState<number>(0)
  const [countInStock, setCountInStock] = useState<number>(0)

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      dispatch(productDeleteThunk(id))
      alert(`${name} has been removed`)
      history.push('/dashboard')
    }
    return
  }
  const handleShowUser = (userId: string) => {
    setUserId(userId)
    setPage('userEditScreen')
  }

  const handleUpdate = () => {
    dispatch(
      updateProductThunk(productInfo?._id!, {
        name,
        brand,
        description,
        category,
        countInStock,
        price,
        image:
          'https://www.usa.philips.com/c-dam/b2c/category-pages/sound-and-vision/fidelio/master/homepage/l3-hero-image.png',
        isNewProduct: true,
      }),
    )
  }

  useEffect(() => {
    dispatch(productInfoThunk(productId))
  }, [dispatch, productId])

  useEffect(() => {
    if (productInfo) {
      dispatch(getUserThunk(productInfo.user))
      setName(productInfo.name)
      setBrand(productInfo.brand)
      setDescription(productInfo.description)
      setCategory(productInfo.category)
      setPrice(productInfo.price)
      setCountInStock(productInfo.countInStock)
    }
  }, [productInfo])

  useEffect(() => {
    if (user) setUserName(user.name)
  }, [user])

  return (
    <div className={s.container}>
      {!productInfo ? (
        <Loader/>
      ) : (
        <>
          <div>
            <input
              onChange={e => setDescription(e.target.value)}
              type="text"
              value={description}
              id="edit-description"
            />
          </div>
          {productInfo.isNewProduct ? <div>Labeled as NEW</div> : <div>Not labeled as NEW</div>}
          <div>
            <div>Read Reviews</div>
          </div>

          <button onClick={handleUpdate}>Update</button>
          <button onClick={() => handleDelete(productId, productInfo.name!)}>Delete</button>
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
              <td>
                <EditableSpan value={name} changeValue={setName}/>
              </td>
            </tr>
            <tr>
              <td>Brand</td>
              <EditableSpan value={brand} changeValue={setBrand}/>
            </tr>
            <tr>
              <td>Category</td>
              <EditableSpan value={category} changeValue={setCategory}/>
            </tr>
            <tr>
              <td>Description</td>
              <EditableSpan value={description} changeValue={setDescription}/>
            </tr>
            <tr>
              <td>In stock</td>
              <td>
                <div className={countInStock <= 0 ? globalStyles.danger : globalStyles.success}>
                  {countInStock}
                </div>
              </td>
            </tr>
            <tr>
              <td>Price</td>
              <td>{price}</td>
            </tr>
            <tr>
              <td>Rating</td>
              <td>{productInfo.rating}</td>
            </tr>
            <tr>
              <td>Count in favorites</td>
              <td>{productInfo.countInFavorite}</td>
            </tr>
            <tr>
              <td>Times viewed</td>
              <td>{productInfo.countViewed}</td>
            </tr>
            <tr>
              <td>Reviews</td>
              <td>{productInfo.numReviews}</td>
            </tr>
            <tr>
              <td>Created</td>
              <td>{productInfo.createdAt}</td>
            </tr>
            <tr>
              <td>Last updated</td>
              <td>{productInfo.updatedAt}</td>
            </tr>
            <tr>
              <td>Created by</td>
              <td>{user ? (
                <div onClick={() => handleShowUser(user._id)}>{userName}</div>
              ) : 'User that created this product is no longer in database.'}</td>
            </tr>
            <tr>
              <td>Images</td>
              <td>
                {productInfo.images.map((image, index) => (
                  <img className={s.image} key={index} src={image.imageSrc} alt={image.imageAlt}/>
                ))}
              </td>
            </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}