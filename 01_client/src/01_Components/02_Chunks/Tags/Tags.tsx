import { FC, useState } from 'react'
import styles from './Tags.module.scss'

// TODO Добавить клавиши enter/esc
type Props = {
  totalTagsCount?: number
}
export const Tags: FC<Props> = ({ totalTagsCount = 10 }) => {
  const [tags, setTags] = useState<string[]>([])
  const [tagsCount, setTagsCount] = useState(totalTagsCount)
  const [tagText, setTagText] = useState('')

  const addTagHandler = () => {
    if (tagText === '') return
    let newTags = tagText.replace(/\s+/g, '')
    let newTagsArr = newTags.split(',').filter((item) => item.length > 0)

    const removedDuplicates = newTagsArr.filter((value) => !tags.includes(value))

    if (tags.length + removedDuplicates.length > 10) {
      const sliced = removedDuplicates.reverse().slice(tags.length + removedDuplicates.length - 10)
      setTags([...tags, ...sliced])
      setTagsCount(0)
      setTagText('')
      return
    }
    setTags([...tags, ...removedDuplicates])
    setTagText('')
    setTagsCount((prev) => prev - removedDuplicates.length)
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
    <div className={styles.container}>
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
