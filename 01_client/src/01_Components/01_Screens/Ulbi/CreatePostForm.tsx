import { FC, useState } from 'react'
// import styles from './Ulbi.module.scss'

export const CreatePostForm: FC<any> = ({ create, setModalMode }) => {
  console.log('PostForm COMPONENT')

  const [id, setId] = useState('')
  const [name, setName] = useState('')

  const submitHandler = (e: any) => {
    e.preventDefault()
    create({
      id,
      name,
      date: Date.now().toString(),
    })
    setId('')
    setName('')
  }

  return (
    <form onSubmit={submitHandler}>
      <input onChange={(e) => setId(e.target.value)} type="text" style={{ margin: '20px', padding: '10px' }} value={id} />
      <input onChange={(e) => setName(e.target.value)} type="text" style={{ margin: '20px', padding: '10px' }} value={name} />
      <input type="submit" value="Add post" style={{ margin: '20px', padding: '10px' }} />
    </form>
  )
}
