import { FC } from 'react'
import { useTypedSelector } from '../../../../../05_Types/01_Base'
import styles from './SalesTable.module.scss'

const products = [
  {
    id: 1,
    productName: 'Nike',
    sales: '260',
    stock: '100',
    price: '299.99',
    status: true,
  },
  {
    id: 2,
    productName: 'Adidas',
    sales: '260',
    stock: '100',
    price: '299.99',
    status: true,
  },
  {
    id: 3,
    productName: 'New Balance',
    sales: '260',
    stock: '100',
    price: '299.99',
    status: false,
  },
  {
    id: 4,
    productName: 'Salomon',
    sales: '260',

    stock: '100',
    price: '299.99',
    status: true,
  },
  {
    id: 5,
    productName: 'G',
    sales: '260',
    stock: '100',
    price: '299.99',
    status: true,
  },
  {
    id: 6,
    productName: 'Nike',
    sales: '260',
    stock: '100',
    price: '299.99',
    status: false,
  },
]

export const SalesTable: FC = () => {
  const { colorTheme } = useTypedSelector(state => state)
  // @ts-ignore
  const themeClass = colorTheme === 'light' ? styles.light_mode : styles.dark_mode
  return (
    <table className={`${styles.table} ${themeClass}`}>
      <thead>
        <tr className={`${styles.table__head} ${themeClass}`}>
          <th>Product Name</th>
          <th>Sales</th>
          <th>Stock</th>
          <th>Price</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {products.map(({ id, productName, sales, stock, price, status }) => (
          <tr key={id}>
            <td>
              <span>{productName}</span>
            </td>
            <td>{sales}</td>
            <td>{stock}</td>
            <td>{price}</td>
            <td style={status ? { color: '#33c863' } : { color: '#eb5757' }}>{status ? 'In Stock' : 'No Stock'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
