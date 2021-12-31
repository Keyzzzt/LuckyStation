import express, { Response, Router } from 'express'
import multer from 'multer'
import path from 'path'
import { privateRoute, adminRoute, deserializeUser } from '@src/middleware'
import { RequestCustom } from './custom'

const router: Router = express.Router()

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  },
})

function checkFileType(file, cb) {
  const fileTypes = /jpg|jpeg|png/
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = fileTypes.test(file.mimetype)

  if (extname && mimetype) {
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

router.post('/', deserializeUser, privateRoute, adminRoute, upload.single('image'), (req: RequestCustom, res: Response) => {
  res.send(`/${req.file.path.replace('\\', '/')}`)
})

export default router
