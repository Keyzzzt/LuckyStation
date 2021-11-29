import React, { useEffect } from 'react'
import { useActions } from '../04_Utils/hooks'
import { useTypedSelector } from '../05_Types/01_Base'

export const MainScreen = () => {
  const { authenticateThunk } = useActions()
  const { id } = useTypedSelector((state) => state.auth)

  return <div>Main</div>
}
