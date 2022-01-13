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
import { deserializeUser } from './middleware'
import { StatisticModel } from './models/statistic.model'

dotenv.config()

export const app: Express = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
)

app.use(helmet())
app.use('/api/upload', uploadRoutes)

app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')))

const PORT = Number(process.env.port)

async function start() {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    })
    const statisticModel = await StatisticModel.findOne({ name: 'Statistic' })
    if (!statisticModel) {
      const doc = new StatisticModel()
      doc.save()
    }
  } catch (error) {
    console.log(error)
  }
}

app.use(deserializeUser)
start()
routes(app)
app.use(errorHandler)

// TODO:  После изменения профиля пользователя, нужно выписать ему новые токены, с новыми данными. Иначе неактуальные данные будут сидеть в токене
// TODO: Не админ может получить любой order если знает orderId. Знать ID не своего заказа он вроде не может. Но нужна защита от дурака.
// TODO: Убрать возможность поменять имейл на фронте, и исключить возможность попытки смены имейла на бэкенде.
// TODO: Сссылка активации только на сутки
// TODO: Отправление имейл при: продаже, новый комментарий, отправлена контактная форма.
