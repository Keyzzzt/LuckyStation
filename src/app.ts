/* eslint-disable no-underscore-dangle */
import express, { Application } from 'express'
import path from 'path'
import dotenv from 'dotenv'
import { connectDB } from '@src/config/db'
import productRoutes from '@src/Routes/productRoutes'
import userRoutes from '@src/Routes/userRoutes'
import orderRoutes from '@src/Routes/orderRoutes'
import uploadRoutes from '@src/Routes/uploadRoutes'
import { notFound, errorHandler } from '@src/middleware/errorMiddleware'

dotenv.config()
connectDB()

const app: Application = express()

app.use(express.json())

app.use('/api/product', productRoutes)
app.use('/api/user', userRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/upload', uploadRoutes)

// const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5002
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})
