import { AnyKeys, FilterQuery } from 'mongoose'
import { UserModel, UserDocument } from '@src/models/user.model'
// TODO Сделать запрос, чтобы приходил без пароля.

export async function findUser(query: FilterQuery<UserDocument>, type) {
  let user
  switch (type) {
    case 'id':
      user = await UserModel.findById(query).select('-password')
      break
    case 'email':
      user = await UserModel.findOne(query)
      break
    case 'all':
      user = await UserModel.find(query)
      break
    default:
      user = undefined
  }
  //TODO Вынести проверку в контроллеры
  // if (!user) throw new Error('User not found')
  return user
}

export async function createUser(input: AnyKeys<UserDocument>) {
  return UserModel.create(input)
}

// TODO Получить пользователя без пароля из базы
// TODO узнать что такое { lean: false }
export async function loginUser({ email, password }: { email: string; password: string }) {
  const user = await findUser({ email }, 'email')
  if (!user) throw new Error('Wrong credentials')

  if (await user.comparePassword(password)) {
    user.password = ''
    return user
  }
  throw new Error('Wrong credentials')
}

// TODO NOT IMPLEMENTED
export async function deleteAllUsers() {
  return UserModel.deleteMany({})
}
