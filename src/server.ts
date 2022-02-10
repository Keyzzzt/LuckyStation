import express, { Express, NextFunction, Response } from 'express'
import fileUpload from 'express-fileupload'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import { routes } from './routes'
import ApiError from '@src/middleware/error.middleware'
import { errorHandler } from '@src/middleware/errorHandler'
import { deserializeUser } from '@src/middleware'
import { RequestCustom } from '@src/custom'

export function createServer() {
  const app: Express = express()
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

  app.post('/api/upload', (req: RequestCustom, res: Response, next: NextFunction) => {
    try {
      if (!req.files) {
        return next(ApiError.NotFound('No file uploaded'))
      }
      const { file } = req.files
      // eslint-disable-next-line consistent-return
      file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
        if (err) {
          return next(ApiError.NotFound(err))
        }
      })
      return res.status(201).json({ fileName: file.name, filePath: `/uploads/${file.name}` })
    } catch (error) {
      return next(error.message)
    }
  })

  app.use(deserializeUser)
  routes(app)
  app.use(errorHandler)

  return app
}
