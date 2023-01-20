import { FC } from 'react'
import { useHistory } from 'react-router-dom'

type Props = {
  path: string
  colorTheme?: string
  disabled?: boolean
  padding?: string
  fontSize?: string
}
export const Button: FC<Props> = ({ children, path, colorTheme = 'light', disabled = false, padding = '10px', fontSize = '1rem' }) => {
  const history = useHistory()
  const returnHandler = () => {
    history.push(path)
  }
  return (
    <button
      style={{
        color: colorTheme === 'dark' ? '#e8e6e3' : '#181a1b',
        backgroundColor: colorTheme === 'dark' ? '#181a1b' : '#e8e6e3',
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
