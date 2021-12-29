import { FC, useEffect, useState } from 'react'
import styles from './ProductEditScreen.module.scss'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import { Link, useHistory } from 'react-router-dom'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import Loader from '../../../02_Chunks/Loader/Loader'
import { ErrorMessage } from '../../../02_Chunks/ErrorMessage/ErrorMessage'
import { useScrollToTop } from '../../../../04_Utils/hooks'
import { productInfoThunk } from '../../../../03_Reducers/product/productInfoReducer'

export const ProductEditScreen: FC = () => {
  useScrollToTop()
  const dispatch = useDispatch()
  const history = useHistory()
  const { productId } = useParams<{ productId: string }>()
  // const { success, loading, error } = useTypedSelector((state) => state.updateProfileByAdmin)
  const { userInfo } = useTypedSelector((state) => state.userInfo)
  const { productInfo, loading, error } = useTypedSelector((state) => state.productInfo)

  // const [role, setRole] = useState(false)

  if (!userInfo) {
    history.push('/login?redirect=dashboard')
  }
  if (userInfo && !userInfo.isAdmin) {
    history.push('/')
  }

  const deleteHandler = (userId: string, email: string) => {
    // if (window.confirm(`Are you sure you want to delete ${email}?`)) {
    //   dispatch(userDeleteThunk(userId))
    //   alert(`${email} has been removed`)
    //   history.push('/dashboard')
    // }
    // return
  }

  const returnHandler = () => {
    // dispatch(actions.getUserResetAC())
    history.push('/dashboard')
  }

  const updateHandler = () => {}
  useEffect(() => {
    if (productInfo?._id !== productId) {
      dispatch(productInfoThunk(productId))
    }
  }, [dispatch, productId, productInfo])

  return (
    <div className={styles.container}>
      {/* {/* {loading && <Loader />} */}
      {error && <ErrorMessage message={error} />}
      <button onClick={returnHandler}>Back</button>
      <button onClick={updateHandler}>Update</button>
      <button onClick={() => deleteHandler(productId, productInfo?.name!)}>Delete</button>
      <div>ID: {productInfo?._id}</div>
      <div>Name: {productInfo?.name}</div>
      <div>Brand: {productInfo?.brand}</div>
      {productInfo?.isNewProduct ? <div>Labeled as NEW</div> : <div>Not labeled as NEW</div>}
      <div>Category: {productInfo?.category}</div>
      <div></div>
      <Link to={`/user/${productInfo?.user}/edit`}>{productInfo?.user}</Link>
      <div>
        <img src={productInfo?.image} alt="Logo" />
      </div>
      <div>Description: {productInfo?.description}</div>
      <div>Rating: {productInfo?.rating}</div>
      <div>Price: {productInfo?.price}</div>
      <div>Count in stock: {productInfo?.countInStock}</div>
      <div>Count in favorites: {productInfo?.countInFavorite}</div>
      <div>Count viewed: {productInfo?.countViewed}</div>
      <div>Count in stock: {productInfo?.countInStock}</div>
      <div>
        <div>Number of Reviews: {productInfo?.numReviews}</div>
        <div>Read Reviews</div>
      </div>
      {productInfo?.colors.length === 0 && <div>Colors not provided for this product</div>}
      {productInfo?.colors.map((color) => (
        <div>
          <span style={{ width: '150px', height: '20px', backgroundColor: color, display: 'inline-block' }}>{color}</span>
        </div>
      ))}
      {productInfo?.sizes.length === 0 && <div>Sizes not provided for this product</div>}
      {productInfo?.sizes.map((size) => (
        <div>
          <span style={{ width: '40px', height: '40px', display: 'inline-block', backgroundColor: 'grey' }}>{size}</span>
        </div>
      ))}
      <div>Created at: {productInfo?.createdAt}</div>
      <div>Updated at: {productInfo?.updatedAt}</div>
    </div>
  )
}
