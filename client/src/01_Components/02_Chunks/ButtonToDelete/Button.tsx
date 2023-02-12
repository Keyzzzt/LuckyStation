import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {
  path: string
  colorTheme?: string
  disabled?: boolean
  padding?: string
  fontSize?: string
}
export const Button: FC<Props> = ({ children, path, colorTheme = 'light', disabled = false, padding = '15px', fontSize = '14px' }) => {
  const navigate = useNavigate()
  const returnHandler = () => {
    navigate(path)
  }
  return (
    <button
      style={{
        color: colorTheme === 'dark' ? '#1b1c1c' : '#f3f3f3',
        backgroundColor: colorTheme === 'dark' ? '#f3f3f3' : '#1b1c1c',
        padding,
        outline: 'none',
        border: '0',
        cursor: 'pointer',
        letterSpacing: '2px',
        fontSize,
      }}
      onClick={returnHandler}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
