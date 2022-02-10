/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import ApiError from './error.middleware'

export function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ error: err.message, errors: err.errors })
  }
  return res.status(500).json({ error: `Не предвиденная ошибка: ${err}`, errors: [] })
}
