import { FC } from 'react'
import { getRandom } from '../../../04_Utils/utils'
import styles from './Ulbi.module.scss'

type Item = {
  id: string
  name: string
  date: string
}
type Props = {
  posts: Item[]
  deletePost: (postId: string) => void
}

export const PostItem: FC<Props> = ({ posts, deletePost }) => {
  // console.log('PostItem COMPONENT')

  return (
    <div>
      {posts.length === 0 ? (
        <div>No posts</div>
      ) : (
        posts.map((item) => (
          <div key={getRandom()} className={styles.item}>
            <div className={styles.itemItem}>
              <span>{item.id}</span>
              <span>{item.name}</span>
              <span>{item.date}</span>
              <span onClick={() => deletePost(item.id)} className={styles.delete}>
                X
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
