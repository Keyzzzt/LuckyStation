import { FC, useState } from 'react'
import styles from './Tags.module.scss'

// TODO Данный компонент можно расширить использованием клавишь enter/esc добавить/отменить написанное.

export const Tags: FC = () => {
  const [tags, setTags] = useState<string[]>([])
  const [tagsCount, setTagsCount] = useState(10)
  const [tagText, setTagText] = useState('')
  console.log(tagText)

  const addTagHandler = () => {
    if (tagText === '') return
    setTags([...tags, tagText])
    setTagText('')
    setTagsCount((prev) => prev - 1)
  }

  const removeTagHandler = (tagIndex: number) => {
    const removed = [...tags].filter((t, i) => tagIndex !== i)
    setTags([...removed])
    setTagsCount((prev) => prev + 1)
  }

  const clearHandler = () => {
    setTagsCount(10)
    setTags([])
  }
  const searchHandler = () => {
    // TODO :
  }

  return (
    <div className={styles.tags}>
      <div className={styles.title}>
        <i className="fas fa-tags" />
        <h2>Tags</h2>
      </div>
      <div className={styles.content}>
        <p>Separate with comma if several tags</p>
        <div className={styles.tagBox}>
          <ul>
            {tags.map((tag, i) => (
              <li key={tag + Math.random() * 20}>
                <p>{tag}</p>
                <i onClick={() => removeTagHandler(i)} className="far fa-times-circle"></i>
              </li>
            ))}

            {tagsCount > 0 && <input onChange={(e) => setTagText(e.target.value)} type="text" value={tagText} placeholder="Type your text here" />}
          </ul>
        </div>
      </div>
      <div className={styles.details}>
        <p>
          <span>{tagsCount}</span> tags remaining
        </p>
        <div>
          {tagsCount > 0 && <button onClick={addTagHandler}>Add</button>}
          <button onClick={clearHandler}>Clear</button>
          <button onClick={searchHandler}>Search</button>
        </div>
      </div>
    </div>
  )
}
