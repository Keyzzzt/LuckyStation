/* eslint-disable no-underscore-dangle */
import express, { Express } from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'
import { connectDB } from '@src/config/db'
import routes from '@src/routes'
import uploadRoutes from '@src/upload.routes'
// import { notFound, errorHandler } from '@src/middleware/error.middleware'

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
// app.use(deserializeUser)

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

// TODO addEventListener от димыча

// TODO Тесты

// TODO Модель для значений изменений интрфейса и прочего админом.
// TODO Узнать, необходимо ли при каждом запросе отправлять пользователя клиенту или нет
// TODO Если пользователь перезагрузил страницу, необходимо перезаписать state на клиенте
// TODO Узнать про разницу жизни cookies и токенов
// TODO Создать объект для статистики и продумать что в нем хранить
// TODO Пользователь должен иметь возможность залогиниться даже если уже залогинен, на случай угона токена. Найти по пользователю сессию - удалить и создать новую.
// TODO Не админ может получить любой order если знает orderId. Знать ID не своего заказа он вроде не может. Но нужна защита от дурака.
