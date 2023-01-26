import { FC, useEffect, useState } from 'react'
import { useTypedSelector } from '../../../05_Types/01_Base'
import s from './pagination.module.scss'

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
    <div className={s.pagination}>
      {products && products.length !== 0 && totalPages > 1 && (
        <ul className={s.list}>
          {activePage > 1 && (
            <li onClick={() => setActivePage((prev) => prev - 1)} className={`${s.prev} ${s.btn}`}>
              <span>
                <i className="fas fa-angle-left" />
                Prev
              </span>
            </li>
          )}
          {pagesCount.map((pageNumber, i) =>
            pageNumber < activePage + 4 && pageNumber > activePage - 4 ? (
              <li
                className={`${s.numb} ${pageNumber === activePage && s.active}`}
                onClick={() => changePageHandler(pageNumber)}
                key={i}
              >
                <span>{pageNumber}</span>
              </li>
            ) : null
          )}

          {activePage < totalPages && (
            <li onClick={() => setActivePage((prev) => prev + 1)} className={`${s.next} ${s.btn}`}>
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
