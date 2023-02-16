import s from './breadcrumbs.module.scss'
import { FC } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  pageTitle: string
  breadcrumbs: string[]
  listCount?: number
}


export const BreadCrumbs: FC<Props> = ({ pageTitle, breadcrumbs, listCount }) => {
          let link = ''
  return (
    <div className={s.breadcrumbs}>
      <p className={s.pageTitle}>{pageTitle}{listCount ? `, TOTAL ${listCount}`: ''}</p>
      <ul>
        {breadcrumbs.map((b, i) => {
          if(i !== breadcrumbs.length - 1)
          {
            link += '/'
            link += `${breadcrumbs[i]}`
          }

          return (
            <li key={i} className={s.breadcrumbs__item}>
              { i === breadcrumbs.length - 1 ? <span className={s.breadcrumbs__link}>{b}</span> : (
                <Link to={link} className={s.breadcrumbs__link + ' ' + s.activeBreadcrumb}>{b}</Link>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
