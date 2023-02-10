/* eslint-disable prettier/prettier */
import express, { Express, NextFunction, Response } from 'express'
import path from 'path'
import multer from 'multer'
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
    }),
  )

  app.use(helmet())


  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'client/public/uploads/')
    },
    filename(req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    },
  })

  function checkFileType(file, cb) {
    const fileTypes = /jpg|jpeg|png/
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase())
    const mimeType = fileTypes.test(file.mimetype)
    if (extName && mimeType) {
      return cb(null, true)
    }
    return cb('Images only!')
  }

  const upload = multer({
    storage,
    fileFilter(req, file, cb) {
      checkFileType(file, cb)
    },
  })

  app.post('/api/upload', upload.single('image'), (req: RequestCustom, res: Response, next: NextFunction) => {
    res.send(`/uploads/${req.file.filename}`)
  })

  // app.post('/api/upload', (req: RequestCustom, res: Response, next: NextFunction) => {
  //   try {
  //     if (!req.files) {
  //       return next(ApiError.NotFound('No file uploaded'))
  //     }
  //     const { image } = req.files
  //     // eslint-disable-next-line consistent-return
  //     image.mv(`${__dirname}/client/public/uploads/${image.name}`, err => {
  //       if (err) {
  //         return next(ApiError.NotFound(err))
  //       }
  //     })
  //     return res.status(201).json({ fileName: image.name, filePath: `/uploads/${image.name}` })
  //   } catch (error) {
  //     return next(error.message)
  //   }
  // })

  app.use(deserializeUser)
  routes(app)
  app.use(errorHandler)
  return app
}
