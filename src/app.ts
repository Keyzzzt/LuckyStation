/* eslint-disable no-underscore-dangle */
import express, { Express } from 'express'
import helmet from 'helmet'
import path from 'path'
import dotenv from 'dotenv'
import { connectDB } from '@src/config/db'
import productRoutes from '@src/routes/product.routes'
import userRoutes from '@src/routes/user.routes'
import orderRoutes from '@src/routes/order.routes'
import uploadRoutes from '@src/routes/upload.routes'
import adminRoutes from '@src/routes/admin.routes'
import { notFound, errorHandler } from '@src/middleware/error.middleware'

dotenv.config()
connectDB()

export const app: Express = express()

app.use(express.json()) // Теперь мы можем парсить JSON в req.body
app.use(express.urlencoded({ extended: false })) // TODO Узнать зачем это
app.use(helmet()) // Для безопасности

app.use('/api/product', productRoutes)
app.use('/api/user', userRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/admin', adminRoutes)

// const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// Глобальные middleware, которые будут использованы при каждом эндпоинте
// app.use(notFound)
// app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})
