import { FC, useState } from 'react'
import { getRandom } from '../../../04_Utils/utils'
// import styles from './Ulbi.module.scss'

type Option = {
  name: string
  value: string
}
type Props = {
  defaultValue: string
  options: Option[]
  value: string
  onChange: (filter: string) => void
}

export const Select: FC<Props> = ({ defaultValue, options, value, onChange }) => {
  console.log('SelectFilter COMPONENT')

  return (
    <div>
      <select onChange={(e) => onChange(e.target.value)} value={value}>
        <option disabled value="">
          {defaultValue}
        </option>
        {options.map((option) => (
          <option key={getRandom()} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  )
}
