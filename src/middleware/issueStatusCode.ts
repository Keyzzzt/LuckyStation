export const issueStatusCode = (code: string): number => {
  switch (code) {
    case 'User not found':
    case 'Users not found':
    case 'Product not found':
    case 'Order not found':
      return 404
    case 'Wrong credentials':
    case 'Not authorized, admin access only':
    case 'Not authorized':
      return 401
    case 'Server error':
      return 500
    default:
      return 400
  }
}
