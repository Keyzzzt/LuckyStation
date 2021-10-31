import express, { Application } from 'express'
import dotenv from 'dotenv'
import { connectDB } from '@src/config/db'
import productRoutes from '@src/Routes/productRoutes'
import userRoutes from '@src/Routes/userRoutes'
// import { destroyData, importData } from '@src/seeder'

dotenv.config()
connectDB()
// importData()
// destroyData()

const app: Application = express()

app.use(express.json())
app.use('/api/products', productRoutes)
app.use('/api/user', userRoutes)
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode)
  res.json({
    resultCode: 0,
    errorMessage: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    data: null,
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})
