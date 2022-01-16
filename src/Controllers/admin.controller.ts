/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-underscore-dangle */
import { NextFunction, Request, Response } from 'express'
import _ from 'lodash'
import { validationResult } from 'express-validator'
import { URL } from 'url'
import { Path } from 'path-parser'
import { RequestCustom } from '@src/custom'
import { ProductModel } from '@src/models/product.model'
import { OrderModel } from '@src/models/order.model'
import { SurveyModel } from '@src/models/survey.model'
import { Mailer } from '@src/services/Mailer'
import { surveyTemplate } from '@src/services/emailTemplates/surveyTemplate'
import { ApiError } from '@src/middleware/error.middleware'
import { UserModel } from '@src/models/user.model'
import { TokenModel } from '@src/models/TokenModel'
import * as utils from '@src/utils'
import { StatisticModel } from '@src/models/statistic.model'

// Frontend DONE
export async function getAllUsers(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    return res.status(200).json(req.paginatedResponse)
  } catch (error) {
    return next(error.message)
  }
}

// Frontend DONE
export async function getStatistic(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    // todo validation
    const statistic = await StatisticModel.findOne({ name: 'Statistic' }).select('-__v -_id -name')
    return res.status(200).json(statistic)
  } catch (error) {
    return next(error.message)
  }
}

// Frontend DONE
export async function removeEmailFromList(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    // todo validation
    const { email } = req.body
    const user = await UserModel.findOne({ email })
    if (user) {
      user.isSubscribed = false
      await user.save()
    }
    await utils.handleEmailInStatistics(email, 'allUsersEmailList', 'remove')
    await utils.handleEmailInStatistics(email, 'allSubscribersEmailList', 'remove')
    return res.sendStatus(200)
  } catch (error) {
    return next(error.message)
  }
}

// Frontend DONE
export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { _id } = req.params
    const user = await UserModel.findById(req.params.id)
    await utils.handleEmailInStatistics(user.email, 'allSubscribersEmailList', 'remove')
    await UserModel.deleteOne({ _id })
    await TokenModel.deleteOne({ user: _id })

    return res.sendStatus(200)
  } catch (error) {
    return next(error.message)
  }
}

// Frontend DONE
export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await await UserModel.findById(req.params.id).select('-password -__v -activationLink -googleId')
    if (!user) {
      return next(ApiError.NotFound('User not found'))
    }
    res.status(200).json(user)
  } catch (error) {
    next(error.message)
  }
}

// Frontend DONE
export async function updateUserProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()))
    }

    const user = await UserModel.findById(req.params.id)
    if (!user) {
      return next(ApiError.NotFound('User not found'))
    }

    const { isAdmin } = req.body

    user.isAdmin = isAdmin

    await user.save()

    return res.status(200).json(user)
  } catch (error) {
    return next(error.message)
  }
}

// Frontend DONE
export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await ProductModel.findById(req.params.id)
    if (!product) {
      return next(ApiError.NotFound('Product not found'))
    }

    await product.remove()
    return res.sendStatus(200)
  } catch (error) {
    return next(error.message)
  }
}

// TODO:
export async function createProduct(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()))
    }

    // TODO:  isNewProduct
    const { name, price, image, brand, category, countInStock, description, isNewProduct } = req.body
    const product = new ProductModel({
      name,
      price,
      user: req.user.id,
      image,
      brand,
      category,
      countInStock,
      description,
      isNewProduct,
    })

    await product.save()

    return res.sendStatus(201)
  } catch (error) {
    return next(error.message)
  }
}

// TODO:
export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()))
    }

    const { name, price, image, brand, category, countInStock, description } = req.body
    const product = await ProductModel.findById(req.params.id)
    if (!product) {
      return next(ApiError.BadRequest('Product not found'))
    }

    product.name = name
    product.price = price
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock
    product.description = description

    await product.save()

    return res.status(201).json(product)
  } catch (error) {
    return next(error.message)
  }
}

// Frontend DONE
export async function getAllOrders(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    return res.status(200).json(req.paginatedResponse)
  } catch (error) {
    return next(error.message)
  }
}

export async function setOrderToPaid(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await OrderModel.findById(req.params.id)
    if (!order) {
      return next(ApiError.NotFound('Order not found'))
    }

    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: '',
      status: '',
      updateTime: '',
      emailAddress: '',
    }

    await order.save()
    return res.status(201).json(200)
  } catch (error) {
    return next(error.message)
  }
}

// TODO:
export async function setOrderToNotPaid(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await OrderModel.findById(req.params.id)
    if (!order) {
      return next(ApiError.NotFound('Order not found'))
    }

    order.isPaid = false
    order.paidAt = undefined
    order.paymentResult = {
      id: '',
      status: '',
      updateTime: '',
      emailAddress: '',
    }

    await order.save()
    return res.status(201).json(200)
  } catch (error) {
    return next(error.message)
  }
}

// TODO:
export async function setOrderToDelivered(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await OrderModel.findById(req.params.id)
    if (!order) {
      return next(ApiError.NotFound('Order not found'))
    }

    order.isDelivered = true
    order.deliveredAt = Date.now()
    await order.save()

    return res.status(201).json(200)
  } catch (error) {
    return next(error.message)
  }
}

// TODO:
export async function setOrderToNotDelivered(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await OrderModel.findById(req.params.id)
    if (!order) {
      return next(ApiError.NotFound('Order not found'))
    }

    order.isDelivered = false
    order.deliveredAt = undefined
    await order.save()

    return res.status(201).json(200)
  } catch (error) {
    return next(error.message)
  }
}

// TODO:
export async function createSurvey(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()))
    }

    const { title, subject, body, recipients } = req.body

    const survey = new SurveyModel({
      title,
      subject,
      body,
      recipients: recipients.split(',').map((email) => ({ email: email.trim() })),
      user: req.user.id,
      dateSent: Date.now(),
    })

    const mailer = new Mailer(survey, surveyTemplate(survey))
    await mailer.send()
    await survey.save()

    return res.sendStatus(201)
  } catch (error) {
    return next(error.message)
  }
}

// TODO:
export async function getAllSurveys(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    return res.status(201).json(req.paginatedResponse)
  } catch (error) {
    return next(error.message)
  }
}

// TODO:
export async function getSurveyById(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const survey = await SurveyModel.findById(req.params.id).select('-recipients -__v -createdAt -updatedAt')
    if (!survey) {
      return next(ApiError.NotFound('Survey not found'))
    }
    return res.status(201).json(survey)
  } catch (error) {
    return next(error.message)
  }
}

export async function manageSendgridEvents(req: RequestCustom, res: Response, next: NextFunction) {
  // TODO: Заменить Path на модуль qs и удалить parth-parser
  try {
    const p = new Path('/api/survey/:surveyId/:choice')
    _.chain(req.body)
      .map(({ url, email }) => {
        const match = p.test(new URL(url).pathname)
        if (match) {
          return {
            email,
            surveyId: match.surveyId,
            choice: match.choice,
          }
        }
      })
      .compact()
      .uniqBy('email', 'surveyId')
      .each(({ surveyId, email, choice }) => {
        SurveyModel.updateOne(
          {
            _id: surveyId,
            recipients: {
              $elemMatch: { email, responded: false },
            },
          },
          {
            $inc: { [choice]: 1 },
            $set: { 'recipients.$.responded': true, 'recipients.$.response': choice },
            lastResponded: new Date(),
          }
        ).exec()
      })
      .value()

    return res.sendStatus(200)
  } catch (error) {
    return next(error.message)
  }
}

// Frontend DONE
export async function deleteSurvey(req: Request, res: Response, next: NextFunction) {
  try {
    const survey = await SurveyModel.findById(req.params.id)
    if (!survey) {
      return next(ApiError.NotFound('Survey not found'))
    }

    await survey.remove()
    return res.sendStatus(200)
  } catch (error) {
    return next(error.message)
  }
}

export async function getAllSubscribers(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    // TODO:
  } catch (error) {
    return next(error.message)
  }
}

export async function allUsersEmailStringForSurvey(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    // TODO:
  } catch (error) {
    return next(error.message)
  }
}
export async function subscribersEmailStringForSurvey(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    // TODO:
  } catch (error) {
    return next(error.message)
  }
}
export async function usersThatBoughtProductEmailStringForSurvey(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    // TODO:
  } catch (error) {
    return next(error.message)
  }
}
export async function getReviewsList(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    // TODO:
  } catch (error) {
    return next(error.message)
  }
}
