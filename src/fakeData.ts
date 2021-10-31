// import bcrypt from 'bcryptjs'
import { hashSync } from 'bcryptjs'
import { ProductType, UserType } from './Types'

export const products: ProductType[] = [
  {
    user: null,
    name: 'AK47',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOyCtPSy5vZ6NNKe6nmW5aEAWDfv2R3bV72g&usqp=CAU',
    description:
      'Visit Our Award - Winning Web Site http://www.oreilly.com/ *** Top 100 Sites on the Web ” — PC Magazine ** Top 5 % Web sites ” —Point Communications *** 3 - Star site ” —The McKinley Group Our web site contains a library of ...',
    brand: 'Microsoft Corporation',
    category: 'Soft',
    rating: 4.5,
    price: 499.0,
    countInStock: 2,
    numReviews: 10,
  },
  {
    user: null,
    name: 'James Bond',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOyCtPSy5vZ6NNKe6nmW5aEAWDfv2R3bV72g&usqp=CAU',
    description:
      'Visit Our Award - Winning Web Site http://www.oreilly.com/ *** Top 100 Sites on the Web ” — PC Magazine ** Top 5 % Web sites ” —Point Communications *** 3 - Star site ” —The McKinley Group Our web site contains a library of ...',
    brand: 'Microsoft Corporation',
    category: 'Soft',
    rating: 4.5,
    price: 499.0,
    countInStock: 2,
    numReviews: 10,
  },
  {
    user: null,
    name: 'James Bond',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOyCtPSy5vZ6NNKe6nmW5aEAWDfv2R3bV72g&usqp=CAU',
    description:
      'Visit Our Award - Winning Web Site http://www.oreilly.com/ *** Top 100 Sites on the Web ” — PC Magazine ** Top 5 % Web sites ” —Point Communications *** 3 - Star site ” —The McKinley Group Our web site contains a library of ...',
    brand: 'Microsoft Corporation',
    category: 'Soft',
    rating: 4.5,
    price: 499.0,
    countInStock: 2,
    numReviews: 10,
  },
]
export const users: UserType[] = [
  {
    name: 'Admin',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123', 10),
    isAdmin: true,
  },
  {
    name: 'James',
    email: 'james@example.com',
    password: hashSync('123', 10),
  },
  {
    name: 'Bond',
    email: 'bond@example.com',
    password: hashSync('123', 10),
  },
]
