import styles from './Banners.module.scss'
import { FC } from 'react'
import { useTypedSelector } from '../../../05_Types/01_Base'
import { configThunk } from '../../../03_Reducers/colorThemeReducer'
import { useDispatch } from 'react-redux'

type Props = {
  placeholder: string
}

export const TopBanner: FC<Props> = ({ placeholder }) => {
  const { colorTheme } = useTypedSelector(state => state)
  const themeClass = colorTheme.mode === 'light' ? styles.light_mode : styles.dark_mode
  const dispatch = useDispatch()
  const toggleColorTheme = () => {
    dispatch(configThunk.toggleColorTheme())
  }
  return (
    <div onClick={toggleColorTheme} className={`${styles.topBanner} ${themeClass}`}>
      {placeholder}
    </div>
  )
}
