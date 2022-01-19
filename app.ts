/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-underscore-dangle */
import express, { Express, NextFunction, Response } from 'express'
import dotenv from 'dotenv'
import fileUpload from 'express-fileupload'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import { routes } from './src/routes'
import { connectDB } from './src/config/db'
import { ApiError, errorHandler } from './src/middleware/error.middleware'
import { deserializeUser } from './src/middleware'
import { StatisticModel } from './src/models/statistic.model'
import { RequestCustom } from './src/custom'

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
app.use(fileUpload())

// @ts-ignore
app.post('/api/upload', (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    if (!req.files) {
      return next(ApiError.NotFound('No file uploaded'))
    }
    const { file } = req.files
    // eslint-disable-next-line consistent-return
    file.mv(`${__dirname}/client/public/uploads/${file.name}`, (err) => {
      if (err) {
        return next(ApiError.NotFound(err))
      }
    })
    // @ts-ignore
    return res.status(201).json({ fileName: file.name, filePath: `/uploads/${file.name}` })
  } catch (error) {
    return next(error.message)
  }
})

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
