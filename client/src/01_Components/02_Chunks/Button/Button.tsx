import { FC } from 'react'
import { useHistory } from 'react-router-dom'

type Props = {
  path: string
  colorTheme: string
  disabled?: boolean
}
export const Button: FC<Props> = ({ children, path, colorTheme, disabled }) => {
  const history = useHistory()
  const returnHandler = () => {
    history.push(path)
  }
  return (
    <button
      style={{
        color: colorTheme === 'dark' ? '#e8e6e3' : '#181a1b',
        backgroundColor: colorTheme === 'dark' ? '#181a1b' : '#e8e6e3',
        padding: '20px 30px',
        outline: 'none',
        border: '0',
        cursor: 'pointer',
        letterSpacing: '2px',
        fontSize: '1.3rem',
      }}
      onClick={returnHandler}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
