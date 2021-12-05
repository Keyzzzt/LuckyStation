import { Request } from 'express'
import { PayloadType } from './newServices/token.service'

export interface RequestCustom extends Request {
  user: PayloadType
  paginatedResponse: any
  file: any
}
