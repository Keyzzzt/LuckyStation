import $api from '../04_Utils/axiosSetup'
import { AxiosResponse } from 'axios'
import { AuthResponse } from '../05_Models/response/AuthResponse'
import { IUser } from '../05_Models/IUser'

export const adminService = {
  fetchAllProducts: '',
  fetchAllOrders: '',
  fetchAllUsers: async (): Promise<AxiosResponse<IUser[]>> => {
    // TODO: Расширить тип IUser для админа
    return $api.get('/admin/user')
  },
}
