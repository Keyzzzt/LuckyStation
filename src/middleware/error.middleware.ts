const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

const errorHandler = (err, req, res) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode)
  res.json({
    resultCode: 0,
    errorMessage: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    data: null,
  })
}

export { notFound, errorHandler }
