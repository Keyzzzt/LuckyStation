import s from './pagination.module.css'

export const Pagination = () => {
  return (
    <div className={s.container}>
      <button type="button" className={s.button}>1</button>
      <button type="button" className={s.button}>2</button>
      <button type="button" className={s.button}>3</button>
      <button type="button" className={s.button}>4</button>
      <button type="button" className={s.button}>5</button>
    </div>
  )
}
