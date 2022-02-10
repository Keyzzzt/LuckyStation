/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react'
import { getRandom } from '../../../04_Utils/utils'
import { useTypedSelector } from '../../../05_Types/01_Base'
import styles from './Pagination.module.scss'

type Props = {
  limit: number
  page: number
  keyword: string
  setPageHandler: (page: number) => void
}

export const Pagination: FC<Props> = ({ limit, page, keyword = '', setPageHandler }) => {
  const [activePage, setActivePage] = useState(1)
  const { totalPages, products } = useTypedSelector((state) => state.productList)

  const pagesCount = []
  for (let i = 1; i <= totalPages; i++) {
    pagesCount.push(i)
  }

  const changePageHandler = (pageNumber: number) => {
    setActivePage(pageNumber)
  }
  useEffect(() => {
    if (activePage > 0) {
      setPageHandler(activePage)
    }
  }, [activePage])

  return (
    <div className={styles.pagination}>
      {products && products.length !== 0 && totalPages > 1 && (
        <ul className={styles.list}>
          {activePage > 1 && (
            <li onClick={() => setActivePage((prev) => prev - 1)} className={`${styles.prev} ${styles.btn}`}>
              <span>
                <i className="fas fa-angle-left" />
                Prev
              </span>
            </li>
          )}
          {pagesCount.map((pageNumber) =>
            pageNumber < activePage + 4 && pageNumber > activePage - 4 ? (
              <li
                className={`${styles.numb} ${pageNumber === activePage && styles.active}`}
                onClick={() => changePageHandler(pageNumber)}
                key={getRandom()}
              >
                <span>{pageNumber}</span>
              </li>
            ) : null
          )}

          {activePage < totalPages && (
            <li onClick={() => setActivePage((prev) => prev + 1)} className={`${styles.next} ${styles.btn}`}>
              <span>
                Next
                <i className="fas fa-angle-right" />
              </span>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}

// export const Pagination: FC<Props> = ({ limit, page, keyword = '', setPageHandler }) => {
//   const { next, prev, totalPages, products } = useTypedSelector((state) => state.productList)

//   let [portionNumber, setPortionNumber] = useState(1)
//   let leftPortionPageNumber = (portionNumber - 1) * limit + 1
//   let rightPortionPageNumber = portionNumber * limit

//   return (
//     <div className={styles.container}>
//       {totalPages > 1 && (
//         <div>
//           {portionNumber > 1 && <button onClick={() => setPortionNumber(portionNumber - 1)}>prev</button>}

//           {[...Array(totalPages).keys()]
//             .filter((p) => p >= leftPortionPageNumber && p <= rightPortionPageNumber)
//             .map((pageNumber) => (
//               <span className={styles.paginationItem} onClick={() => setPageHandler(page)} key={uuidv4()}>
//                 {pageNumber}
//               </span>
//             ))}
//           {limit > portionNumber && <button onClick={() => setPortionNumber(portionNumber + 1)}>next</button>}
//         </div>
//       )}
//     </div>
//   )
// }
