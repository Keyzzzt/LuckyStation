/* eslint-disable no-underscore-dangle */
import express, { Express } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'
import dotenv from 'dotenv'
import { connectDB } from '@src/config/db'
import routes from '@src/routes'
import uploadRoutes from '@src/upload.routes'
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

app.use('/api/upload', uploadRoutes)

// const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// Глобальные middleware, которые будут использованы при каждом эндпоинте
// app.use(notFound)
// app.use(errorHandler)

const PORT = Number(process.env.port)
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})
routes(app)
