import { FC, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTypedSelector } from '../../../05_Types/01_Base'
import styles from './pagination.module.css'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  limit: number
  page: number
  keyword: string
  setPageHandler: (page: number) => void
}

export const PaginationV2: FC<Props> = ({ limit, page, keyword = '', setPageHandler }) => {
  const { next, prev, totalPages, products } = useTypedSelector((state) => state.productList)

  let [portionNumber, setPortionNumber] = useState(1)
  let leftPortionPageNumber = (portionNumber - 1) * limit + 1
  let rightPortionPageNumber = portionNumber * limit

  return (
    <div className={styles.container}>
      {totalPages > 1 && (
        <div>
          {portionNumber > 1 && <button onClick={() => setPortionNumber(portionNumber - 1)}>prev</button>}

          {[...Array(totalPages).keys()]
            .filter((p) => p >= leftPortionPageNumber && p <= rightPortionPageNumber)
            .map((pageNumber) => (
              <span className={styles.paginationItem} onClick={() => setPageHandler(page)} key={uuidv4()}>
                {pageNumber}
              </span>
            ))}
          {limit > portionNumber && <button onClick={() => setPortionNumber(portionNumber + 1)}>next</button>}
        </div>
      )}
    </div>
  )
}
