import { FC, FormEvent, useState } from 'react'
// import styles from './Ulbi.module.scss'

interface Props {
  create: ({ id, name, date }: { id: string; name: string; date: string }) => void
}

export const CreatePostForm: FC<Props> = ({ create }) => {
  console.log('PostForm COMPONENT')

  const [id, setId] = useState('')
  const [name, setName] = useState('')

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
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
