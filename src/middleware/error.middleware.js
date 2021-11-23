import { ApiError } from '@src/exceptions/api.error'

export function errorHandler(err, req, res) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ resultCode: 0, message: err.message, errors: err.errors })
  }
  return res.status(500).json({ resultCode: 0, message: 'Не предвиденная ошибка' })
}
