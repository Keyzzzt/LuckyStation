import { FC, useState } from 'react'
import styles from './Accordion.module.scss'
import { AccordionItem } from './AccordionItem'

export type AccordionData = {
  title: string
  content: any
}
export type Props = {
  items: AccordionData[]
}

export const Accordion: FC<Props> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(-1)
  const btnOnClick = (index: number) => {
    // Если при клике индексы совпадают, то значит кликнули по уже открытому аккордиону, возвращаем -1 чтобы закрыть
    setCurrentIndex(prev => (prev === index ? -1 : index))
  }
  return (
    <ul className={styles.accordion}>
      {items.map((item, i) => (
        <AccordionItem data={item} key={i} isOpen={currentIndex === i} btnOnClick={() => btnOnClick(i)} />
      ))}
    </ul>
  )
}
