/* eslint-disable no-underscore-dangle */
import express, { Express } from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'
import { connectDB } from '@src/config/db'
import { routes } from '@src/routes'
import uploadRoutes from '@src/upload.routes'
import { errorHandler } from '@src/middleware/error.middleware'
import { deserializeUser } from './middleware/auth.middleware'

dotenv.config()

export const app: Express = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false })) // TODO: Узнать зачем это
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
)
// app.use(deserializeUser)
app.use(helmet()) // Для безопасности

app.use('/api/upload', uploadRoutes)

// const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// Глобальные middleware, которые будут использованы при каждом эндпоинте
// app.use(notFound)
// app.use(errorHandler)

const PORT = Number(process.env.port)

async function start() {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}
start()

routes(app)
app.use(errorHandler)

// TODO:  После изменения профиля пользователя, нужно выписать ему новые токены, с новыми данными. Иначе неактуальные данные будут сидеть в токене

// TODO: Не админ может получить любой order если знает orderId. Знать ID не своего заказа он вроде не может. Но нужна защита от дурака.
