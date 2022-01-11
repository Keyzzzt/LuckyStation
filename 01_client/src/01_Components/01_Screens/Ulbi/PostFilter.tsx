import { FC } from 'react'
import { Select } from './SelectFilter'
// import styles from './Ulbi.module.scss'

type Filter = {
  query: string
  sort: string
}

type Props = {
  filter: {
    query: string
    sort: string
  }
  options: { value: string; name: string }[]
  setFilter: (filter: Filter) => void
}

export const PostFilter: FC<Props> = ({ filter, setFilter, options }) => {
  console.log('PostFilter COMPONENT')

  return (
    <div>
      <input onChange={(e) => setFilter({ ...filter, query: e.target.value })} type="text" placeholder="Search for..." value={filter.query} />
      <Select defaultValue="Sort by" options={options} value={filter.sort} onChange={(selectedSort) => setFilter({ ...filter, sort: selectedSort })} />
    </div>
  )
}
