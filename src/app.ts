/* eslint-disable no-underscore-dangle */
import express, { Express } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'
import dotenv from 'dotenv'
import { connectDB } from '@src/config/db'
import productRoutes from '@src/routes/product.routes'
import userRoutes from '@src/routes/user.routes'
import orderRoutes from '@src/routes/order.routes'
import uploadRoutes from '@src/routes/upload.routes'
import adminRoutes from '@src/routes/admin.routes'
import sessionsRoutes from '@src/routes/sessions.routes'
// import { notFound, errorHandler } from '@src/middleware/error.middleware'
import { deserializeUser } from './middleware/auth.middleware'

dotenv.config()
connectDB()

export const app: Express = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false })) // TODO Узнать зачем это
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
)
app.use(helmet()) // Для безопасности
app.use(deserializeUser)

app.use('/api/product', productRoutes)
app.use('/api/user', userRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api', sessionsRoutes)

// const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// Глобальные middleware, которые будут использованы при каждом эндпоинте
// app.use(notFound)
// app.use(errorHandler)

const PORT = Number(process.env.port)
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})
