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

// TODO Если что то изменили, то нужно перед выходом спросить, не забыл ли сохранить

export const ProductEditScreen: FC<Props> = ({ productId, setUserId, setPage }) => {
  const history = useHistory()
  useScrollToTop()
  const dispatch = useDispatch()
  const { productInfo } = useTypedSelector(state => state.productInfo)
  const { user } = useTypedSelector(state => state.getUser)

  // TODO Refactor to useReducer()
  const [userName, setUserName] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [brand, setBrand] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [description2, setDescription2] = useState<string>('')
  const [care, setCare] = useState<string>('')
  const [quality, setQuality] = useState<string>('')
  const [colors, setColors] = useState<string[]>([])
  const [colorsInText, setColorsInText] = useState<string>('')
  const [materials, setMaterials] = useState<string>('')
  const [weight, setWeight] = useState<string>('')
  const [includes, setIncludes] = useState<string>('')
  const [price, setPrice] = useState<number>(0)
  const [countInStock, setCountInStock] = useState<number>(0)
  const [createdDate, setCreatedDate] = useState<Date>()
  const [lastUpdatedDate, setLastUpdatedDate] = useState<Date>()
  console.log(productInfo)

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
    setPage('userEdit')
  }

  const handleUpdate = () => {
    dispatch(
      updateProductThunk(productInfo?._id!, {
        name,
        brand,
        description,
        description2,
        care,
        quality,
        category,
        countInStock,
        colorsInText,
        materials,
        weight,
        includes,
        price,
        colors,
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
      setDescription2(productInfo.description2)
      setCare(productInfo.careInstructions)
      setQuality(productInfo.quality)
      setColors(productInfo.colors)
      setColorsInText(productInfo.colorsInText)
      setMaterials(productInfo.materials)
      setWeight(productInfo.weight)
      setIncludes(productInfo.includes)
      setCategory(productInfo.category)
      setPrice(productInfo.price)
      setCountInStock(productInfo.countInStock)
      setCreatedDate(productInfo.createdAt)
      setLastUpdatedDate(productInfo.updatedAt)
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
              <td>ID</td>
              <td>{productInfo._id}</td>
            </tr>
            <tr>
              <td>Created by</td>
              <td>{user ? (
                <button onClick={() => handleShowUser(user._id)} className={globalStyles.success}>{userName}</button>
              ) : 'User that created this product is no longer in database.'}</td>
            </tr>
            <tr>
              <td>Created</td>
              <td>
                {createdDate}
              </td>
            </tr>
            <tr>
              <td>Last updated</td>
              <td>
                {createdDate === lastUpdatedDate ? 'No updates' : lastUpdatedDate}
              </td>
            </tr>
            <tr>
              <td>Name</td>
              <td>
                <EditableSpan value={name} changeValue={setName}/>
              </td>
            </tr>
            <tr>
              <td>Brand</td>
              <td><EditableSpan value={brand} changeValue={setBrand}/></td>
            </tr>
            <tr>
              <td>Category</td>
              <td><EditableSpan value={category} changeValue={setCategory}/></td>
            </tr>
            <tr>
              <td>Description</td>
              <td><EditableSpan value={description} changeValue={setDescription} asTextArea/></td>
            </tr>
            <tr>
              <td>Description +</td>
              <td><EditableSpan value={description2} changeValue={setDescription2} asTextArea/></td>
            </tr>
            <tr>
              <td>Care</td>
              <td><EditableSpan value={care} changeValue={setCare} asTextArea/></td>
            </tr>
            <tr>
              <td>Quality</td>
              <td><EditableSpan value={quality} changeValue={setQuality} asTextArea/></td>
            </tr>
            <tr>
              <td>Colors</td>
              <td>{colors.map((color, i) => (
                <span key={i} style={{ backgroundColor: color }} className={s.colors}/>
              ))}</td>
            </tr>
            <tr>
              <td>Colors in text</td>
              <td><EditableSpan value={colorsInText} changeValue={setColorsInText}/></td>
            </tr>
            <tr>
              <td>Materials</td>
              <td><EditableSpan value={materials} changeValue={setMaterials} asTextArea/></td>
            </tr>
            <tr>
              <td>Includes</td>
              <td><EditableSpan value={includes} changeValue={setIncludes} asTextArea/></td>
            </tr>
            <tr>
              <td>Weight</td>
              <td><EditableSpan value={weight} changeValue={setWeight}/></td>
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
              <td>Image label</td>
              <td>{productInfo.isNewProduct ? 'NEW' : 'No label'}</td>
            </tr>
            <tr>
              <td>Images</td>
              <td>
                {productInfo.images.map((image, index) => (
                  <img className={s.image} key={index} src={image.imageSrc} alt={image.imageAlt}/>
                ))}
              </td>
            </tr>
            <tr>
              <td>Reviews</td>
              <td>{productInfo.reviews.length > 0 ? <button
                className={globalStyles.success}>{productInfo.reviews.length} Reviews</button> : 'No reviews'} </td>
            </tr>
            </tbody>
          </table>
          <div className={s.buttons}>
            <button className={globalStyles.success} onClick={handleUpdate}>Update</button>
            <button className={globalStyles.danger} onClick={handleUpdate}>Reset</button>
            <button className={globalStyles.danger} onClick={() => handleDelete(productId, productInfo.name!)}>Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}

