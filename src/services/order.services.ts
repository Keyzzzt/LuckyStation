import { OrderModel } from '@src/models/order.model'

export async function findOrder(query, type) {
  let order
  switch (type) {
    case 'id':
      order = await OrderModel.findById(query).populate('user', 'name email')
      break
    case 'all':
      order = await OrderModel.find(query)
      break
    default:
      order = undefined
  }

  if (!order) throw new Error('Order not found')
  return order
}

export async function createOrder(order) {
  return OrderModel.create(order)
}
