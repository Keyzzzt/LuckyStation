/* eslint-disable prettier/prettier,no-underscore-dangle */
import { NextFunction, Request, Response } from 'express'
// import { validationResult } from 'express-validator'
import { RequestCustom } from '@src/custom'
import ApiError from '@src/middleware/error.middleware'
import { GalleryModel } from '@src/models/gallery.model'

export async function addGalleryItem(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    // const errors = validationResult(req)
    // if (!errors.isEmpty()) {
    //   return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()))
    // }
    const { title, src, className, description } = req.body
    const galleryImage = new GalleryModel({
      title,
      src,
      user: req.user._id,
      className,
      description,
    })

    await galleryImage.save()

    return res.status(201)
  } catch (error) {
    return next(error.message)
  }
}
export async function getGalleryItems(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const items = await GalleryModel.find({}).select('-__v')
    return res.status(200).json(items)
  } catch (error) {
    return next(error.message)
  }
}

export async function getGallerySingleItem(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const item = await GalleryModel.findById(req.params.id).select('-__v')
    return res.status(200).json(item)
  } catch (error) {
    return next(error.message)
  }
}

export async function updateGalleryItem(req: Request, res: Response, next: NextFunction) {
  try {
    // const errors = validationResult(req)
    // if (!errors.isEmpty()) {
    //   return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()))
    // }

    const {title, src, className, description, } = req.body
    const item = await GalleryModel.findById(req.params.id).select('-__v')
    if (!item) {
      return next(ApiError.BadRequest('Not found'))
    }

    item.title = title
    item.src = src
    item.className = className
    item.description = description

    await item.save()

    return res.status(200).json(item)
  } catch (error) {
    return next(error.message)
  }
}
