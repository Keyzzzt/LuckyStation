import { Request } from 'express'
import { PayloadType } from './types'

export interface RequestCustom extends Request {
  user: PayloadType
  paginatedResponse: any
  file: any
}
