import { users } from '@src/fakeData'
import { products } from '@src/fakeData'
import { User } from '@src/Models/UserModel'
import { Product } from '@src/Models/ProductModel'
import { Order } from '@src/Models/OrderModel'

export const importData = async () => {
  try {
    await Order.deleteMany()
    await User.deleteMany()
    await Product.deleteMany()

    const createdUsers = await User.insertMany(users)
    const admin = createdUsers[0]._id
    const sampleProducts = products.map((product) => {
      return { ...product, user: admin }
    })

    await Product.insertMany(sampleProducts)
    console.log('Data imported to database')
    process.exit()
  } catch (error) {
    console.error(`${error}`)
    process.exit(1)
  }
}

export const destroyData = async () => {
  try {
    await Order.deleteMany()
    await User.deleteMany()
    await Product.deleteMany()
    console.log('Data destroyed!')
    process.exit()
  } catch (error) {
    console.error(`${error}`)
    process.exit(1)
  }
}

// if (process.argv[2] === '-d') {
//   destroyData()
// } else {
//   importData()
// }
