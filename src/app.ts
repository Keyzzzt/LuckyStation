import express, { Application } from 'express'
import dotenv from 'dotenv'
import { connectDB } from '@src/config/db'
import productRoutes from '@src/Routes/productRoutes'
import userRoutes from '@src/Routes/userRoutes'
import { notFound, errorHandler } from '@src/middleware/errorMiddleware'

dotenv.config()
connectDB()

const app: Application = express()

app.use(express.json())
app.use('/api/products', productRoutes)
app.use('/api/user', userRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})
