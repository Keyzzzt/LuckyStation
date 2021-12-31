import express, { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { privateRoute, adminRoute } from '@src/middleware'
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

router.post('/', privateRoute, adminRoute, upload.single('image'), (req: RequestCustom, res) => {
  res.send(`/${req.file.path}`)
})

export default router
