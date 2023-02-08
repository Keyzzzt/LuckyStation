import s from './galleryAdmin.module.scss'
import { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../../../05_Types/01_Base'
import { Message } from '../../../02_Chunks/Message/Message'
import Loader from '../../../02_Chunks/Loader/Loader'
import { useScrollToTop } from '../../../../04_Utils/hooks'
import { orderInfoThunk } from '../../../../03_Reducers/order/orderInfoReducer'
import {
  deleteOrderThunk,
  deliveredThunk,
  notDeliveredThunk,
  notPaidThunk,
  paidThunk,
} from '../../../../03_Reducers/order/orderManageReducer'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router'
import { BreadCrumbs } from '../../../02_Chunks/Breadcrumbs/Breadcrumbs'
import { toLocal } from '../../../../04_Utils/utils'



export const GalleryAdmin: FC = () => {


  return (
    <div className={s.container}>

    </div>
  )
}
