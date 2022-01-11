import { FC, useState } from 'react'
import { PostFilter } from './PostFilter'
import { CreatePostForm } from './CreatePostForm'
import { PostItem } from './PostItem'
import styles from './Ulbi.module.scss'
import { Modal } from '../../02_Chunks/Modal/Modal'
import { useSelectByFilterAndQuery } from '../../../04_Utils/hooks'
const defaultPosts = [
  {
    id: '1',
    name: 'Nike',
    date: Date.now().toString(),
  },
  {
    id: '2',
    name: 'Adidas',
    date: Date.now().toString(),
  },
  {
    id: '3',
    name: 'New Balance',
    date: Date.now().toString(),
  },
  {
    id: '4',
    name: 'Puma',
    date: Date.now().toString(),
  },
]

// Новый, старые, дорогие, дешевые, размер / площадь, цена за кв.м, популярность
const options = [
  { name: 'Sort by name', value: 'name' },
  { name: 'Sort by date', value: 'date' },
]

type Item = {
  id: string
  name: string
  date: string
}

export const Ulbi: FC = () => {
  // console.log('Ulbi COMPONENT')

  const [posts, setPosts] = useState<Item[]>(defaultPosts)
  const [filter, setFilter] = useState({ sort: '', query: '' })
  const [modalMode, setModalMode] = useState(false)

  const createPost = (post: any) => {
    setModalMode(false)
    setPosts([...posts, post])
  }

  const sortedAndSearchedItems = useSelectByFilterAndQuery(posts, filter.sort, filter.query)

  const deletePost = (id: string) => {
    setPosts([...posts].filter((item) => item.id !== id))
  }
  return (
    <section className={styles.container}>
      <button onClick={() => setModalMode(true)}>Create Post</button>
      <Modal isActive={modalMode} setIsActive={setModalMode}>
        <CreatePostForm create={createPost} />
      </Modal>
      <PostFilter filter={filter} setFilter={setFilter} options={options} />
      <PostItem posts={sortedAndSearchedItems} deletePost={deletePost} />
    </section>
  )
}
