import React from 'react'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import styles from './CustomersList.module.scss'

const customers = [
  {
    id: 1,
    name: 'James Bond',
    email: 'james@bond.com',
    img: 'https://i.pinimg.com/originals/6b/aa/98/6baa98cc1c3f4d76e989701746e322dd.png',
  },
  {
    id: 2,
    name: 'James Bond',
    email: 'james@bond.com',
    img: 'https://i.pinimg.com/originals/6b/aa/98/6baa98cc1c3f4d76e989701746e322dd.png',
  },
  {
    id: 3,
    name: 'James Bond',
    email: 'james@bond.com',
    img: 'https://i.pinimg.com/originals/6b/aa/98/6baa98cc1c3f4d76e989701746e322dd.png',
  },
  {
    id: 4,
    name: 'James Bond',
    email: 'james@bond.com',
    img: 'https://i.pinimg.com/originals/6b/aa/98/6baa98cc1c3f4d76e989701746e322dd.png',
  },
  {
    id: 5,
    name: 'James Bond',
    email: 'james@bond.com',
    img: 'https://i.pinimg.com/originals/6b/aa/98/6baa98cc1c3f4d76e989701746e322dd.png',
  },
]

export const CustomersList = () => {
  const { config } = useTypedSelector((state) => state)
  const themeClass = config.colorTheme === 'light' ? styles.light_mode : styles.dark_mode
  return (
    <div className={`${styles.customerslist} ${themeClass}`}>
      <div className={styles.customerslist__header}>
        <h2 className={`${styles.customerslist__header__title} ${themeClass}`}>Customers</h2>
      </div>
      <div className={styles.list}>
        {customers.map(({ id, name, email, img }) => (
          <div key={id} className={styles.list__item}>
            <div className={styles.list__item__img}>
              <img src={img} alt={`${name} head shot`} className={styles.img} />
            </div>
            <div className={styles.info}>
              <span className={`${styles.name} ${themeClass}`}>{name}</span>
              <span className={`${styles.email} ${themeClass}`}>{email}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
