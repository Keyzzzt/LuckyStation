import s from './products.module.scss'
import React, { FC, useMemo, useState } from 'react'
import { Message } from '../../../02_Chunks/Message/Message'
import Loader from '../../../02_Chunks/Loader/Loader'
import { useNavigate } from 'react-router-dom'
import { ProductResponseType } from '../../../../05_Types/ResponseTypes'

type Props = {
  products: ProductResponseType[] | null
  setSortFilter: (filter: string) => void
}

export const ProductsList: FC<Props> = ({ products, setSortFilter }) => {
  console.log('PRODUCTS LIST')
  const [isNameAZ, setIsNameAZ] = useState(false)
  const [isCategoryAZ, setIsCategoryAZ] = useState(false)
  const [isBrandAZ, setIsBrandAZ] = useState(false)
  const [isInStockAZ, setIsInStockAZ] = useState(false)
  const [isPriceAZ, setIsPriceAZ] = useState(false)
  const navigate = useNavigate()



  const handleFilter = (filter: string) => {
    switch (filter) {
      case 'name':
        setIsNameAZ(!isNameAZ)
        isNameAZ ? setSortFilter('nameAZ') : setSortFilter('nameZA')
        break
      case 'category':
        setIsCategoryAZ(!isCategoryAZ)
        isCategoryAZ ? setSortFilter('categoryAZ') : setSortFilter('categoryZA')
        break
      case 'brand':
        setIsBrandAZ(!isBrandAZ)
        isBrandAZ ? setSortFilter('brandAZ') : setSortFilter('brandZA')
        break
      case 'inStock':
        setIsInStockAZ(!isInStockAZ)
        isInStockAZ ? setSortFilter('inStockAZ') : setSortFilter('inStockZA')
        break
      case 'price':
        setIsPriceAZ(!isPriceAZ)
        isPriceAZ ? setSortFilter('lowestPriceFirst') : setSortFilter('highestPriceFirst')
        break
    }
  }
  return (
    <>
      {products?.length === 0 && <Message message='You have no products yet...' type="fail"/>}
      <div className={s.list}>
        {!products ? (
          <Loader/>
        ) : (
          <>
            <table className='stationTable'>
              <thead>
              <tr>
                <th>
                  <div onClick={() => handleFilter('name')}>Name {isNameAZ
                    ? <i className="fa-sharp fa-solid fa-caret-up"/>
                    : <i className="fa-sharp fa-solid fa-caret-down"/>}
                  </div>
                </th>
                <th>
                  <div onClick={() => handleFilter('brand')}>Brand {isBrandAZ
                    ? <i className="fa-sharp fa-solid fa-caret-up"/>
                    : <i className="fa-sharp fa-solid fa-caret-down"/>}
                  </div>
                </th>
                <th>
                  <div onClick={() => handleFilter('category')}>Category {isCategoryAZ
                    ? <i className="fa-sharp fa-solid fa-caret-up"/>
                    : <i className="fa-sharp fa-solid fa-caret-down"/>}
                  </div>
                </th>
                <th>
                  <div onClick={() => handleFilter('inStock')}>In stock {isInStockAZ
                    ? <i className="fa-sharp fa-solid fa-caret-up"/>
                    : <i className="fa-sharp fa-solid fa-caret-down"/>}
                  </div>
                </th>
                <th>
                  <div onClick={() => handleFilter('price')}>Price {isPriceAZ
                    ? <i className="fa-sharp fa-solid fa-caret-up"/>
                    : <i className="fa-sharp fa-solid fa-caret-down"/>}
                  </div>
                </th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.brand}</td>
                  <td>{p.category}</td>
                  <td>
                    <div className={p.countInStock <= 0 ? 'danger' : 'success'}>
                      {p.countInStock}
                    </div>
                  </td>
                  <td>{p.price}</td>
                  <td>
                    <button onClick={() => navigate(`/dashboard/products/${p._id}`)} className='success'>More info</button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  )
}

export const MemoizedProductsList = React.memo(ProductsList)