import React, { FC, useEffect, useState } from 'react'
import s from './productEdit.module.scss'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { useScrollToTop } from '../../../../04_Utils/hooks'
import { productInfoTC } from '../../../../03_Reducers/product/productInfoReducer'
import { productDeleteTC } from '../../../../03_Reducers/admin/productDeleteReducer'
import { updateProductTC } from '../../../../03_Reducers/admin/updateProductReducer'
import Loader from '../../../02_Chunks/Loader/Loader'
import { EditableSpan } from '../../../02_Chunks/EditableSpan/EditableSpan'
import { getUserTC } from '../../../../03_Reducers/admin/getUserReducer'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router'
import { BreadCrumbs } from '../../../02_Chunks/Breadcrumbs/Breadcrumbs'
import { parseCreatedUpdated } from '../../../../04_Utils/utils'
import { Button } from '../../../02_Chunks/Button/Button'


export const ProductEdit: FC = () => {
  const navigate = useNavigate()
  const { productId } = useParams()
  useScrollToTop()
  const dispatch = useDispatch()
  const { productInfo } = useTypedSelector(state => state.productInfo)
  const { user } = useTypedSelector(state => state.getUser)

  // TODO Refactor to useReducer()
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

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      dispatch(productDeleteTC(id))
      alert(`${name} has been removed`)
      navigate('/dashboard')
    }
    return
  }
  const handleShowUser = (userId: string) => {
    console.log(productInfo?.user)
  }

  const handleUpdate = () => {
    // TODO check fields
    productInfo && dispatch(
      updateProductTC(productInfo._id!, {
        name,
        brand,
        description,
        description2,
        care,
        quality,
        category,
        countInStock: productInfo.countInStock,
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
  const handleReset = () => {
    productId && dispatch(productInfoTC(productId))
  }

  useEffect(() => {
    productId && dispatch(productInfoTC(productId))
  }, [productId])

  useEffect(() => {
    if (productInfo) {
      dispatch(getUserTC(productInfo.user))
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
    }
  }, [productInfo])

  return (
    <div className={s.container}>
      {!productInfo ? (
        <Loader/>
      ) : (
        <>
          <BreadCrumbs pageTitle={productInfo.brand + ' ' + productInfo.name}
                       breadcrumbs={['dashboard', 'products', 'product']}/>
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
              <td>ID</td>
              <td>{productInfo._id}</td>
            </tr>
            <tr>
              <td>Created by</td>
              <td>{user ? (
                <>
                  <Button onClick={() => handleShowUser(user._id)} title={user.name} type='button' color='success' padding='5px' marginRight='20px'/>
                  {user.isAdmin && <Button title='Admin' type='button' color='success' padding='5px'/>}
                </>
              ) : 'User that created this product is no longer in database.'}</td>
            </tr>
            <tr>
              <td>Created</td>
              <td>
                {parseCreatedUpdated(productInfo.createdAt, 'date&time')}
              </td>
            </tr>
            <tr>
              <td>Last updated</td>
              <td>
                {productInfo.createdAt === productInfo.updatedAt ? '-' : parseCreatedUpdated(productInfo.updatedAt, 'date&time')}
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
                {productInfo.countInStock > 0 ? (
                  <Button title={productInfo.countInStock.toString()} type='button' color='success' minWidth='50px'
                          padding='5px'/>
                ) : (
                  <Button title={productInfo.countInStock.toString()} type='button' color='danger' minWidth='50px'
                          padding='5px'/>
                )}
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
                className='success'>{productInfo.reviews.length} Reviews</button> : 'No reviews'} </td>
            </tr>
            </tbody>
          </table>
          <div className={s.buttons}>
            <Button onClick={handleUpdate} title='Update' type='button' color='success'/>
            <Button onClick={handleReset} title='Reset' type='button' color='danger'/>
            <Button onClick={() => handleDelete(productId!, productInfo.name!)} title='Delete' type='button'
                    color='danger'/>
          </div>
        </>
      )}
    </div>
  )
}

