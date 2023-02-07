import { FC, useState } from 'react'
import s from './notFound.module.scss'
import { Link } from 'react-router-dom'

type Page404Props = {
  companyName: string
}
export const Page404: FC<Page404Props> = ({companyName}) => {


  return (
    <main className={s.localSection}>
      <div className={s.localContainer}>
        <Link className={s.homeButton} to='/'>home</Link>
        <div className={s.box}>
          <div className={s.innerBox}/>
          <h1>{companyName}</h1>
          <p>404 E</p>
        </div>
        <p className={s.bottomText}>Sorry, the page you are looking for cannot be found.</p>
      </div>

    </main>
  )
}
