import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { StateType } from '../store'

export type InferActionTypes<T> = T extends { [key: string]: (...args: any[]) => infer U } ? U : never
export type BaseThunkType<A extends Action, R = Promise<void>> = ThunkAction<R, StateType, any, A>
export const useTypedSelector: TypedUseSelectorHook<StateType> = useSelector

export type RequestBodyValidationErrorsType = {
  location: string
  msg: string
  param: string
  value: string
}
