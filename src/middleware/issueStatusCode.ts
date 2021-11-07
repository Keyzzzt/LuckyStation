export const issueStatusCode = (code: string): number => {
  switch (code) {
    case 'Server error':
      return 500
    case 'User not found':
    case 'Users not found':
    case 'Product not found':
    case 'Order not found':
      return 404
    case 'Wrong credentials':
    case 'Not authorized, admin access only':
    case 'Not authorized':
      return 401
    case 'Google account is not verified':
      return 403
    default:
      return 400
  }
}
