// import { AnyKeys, FilterQuery } from 'mongoose'
import { ProductModel } from '@src/models/product.model'

export async function findProduct(query, type) {
  let product
  switch (type) {
    case 'id':
      product = await ProductModel.findById(query)
      break
    case 'all':
      product = await ProductModel.find(query).populate('user', 'id name')
      break
    default:
      product = undefined
  }

  if (!product) throw new Error('Product not found')
  return product
}
