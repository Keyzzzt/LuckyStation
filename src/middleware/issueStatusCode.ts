// TODO Заменить все Not authorized на ----> You are not authorized to access this application

export const issueStatusCode = (code: string): number => {
  switch (code) {
    case 'Server error':
      return 500
    case 'User not found':
    case 'Users not found':
    case 'Product not found':
    case 'Order not found':
    case 'No surveys found':
      return 404
    case 'Admin only':
    case 'Not authorized':
    case 'You are not authorized to access this application':
      return 401
    case 'Google account is not verified':
      return 403
    default:
      return 400
  }
}
