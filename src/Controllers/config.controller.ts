import { NextFunction, Request, Response } from 'express'
import { AppConfigModel } from '@src/models/appConfig.model'
import ApiError from '@src/middleware/error.middleware'

export async function getConfig(req: Request, res: Response, next: NextFunction) {
  try {
    const config = await AppConfigModel.findOne({ name: 'Config' })
    if (!config) {
      return next(
        ApiError.NotFound('App config not found, please check app.ts / database connection / contact developer')
      )
    }
    return res.status(200).json(config)
  } catch (error) {
    return next(error.message)
  }
}
