import { FC, ReactNode, useEffect, useRef, useState } from 'react'
import styles from './Accordion.module.scss'
import { AccordionData } from './Accordion'
import { getRefValue } from '../../../04_Utils/getRefValue'

type Props = {
  data: AccordionData
  isOpen: boolean
  btnOnClick: () => void
}

export const AccordionItem: FC<Props> = ({ data, isOpen, btnOnClick }) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (isOpen) {
      const contentEl = getRefValue(contentRef)
      setHeight(contentEl.scrollHeight)
    } else {
      setHeight(0)
    }
  }, [isOpen])
  return (
    <li className={`${styles.accordionItem} ${isOpen ? styles.active : ''}`}>
      <h2 className={styles.accordionItemTitle}>
        <button onClick={btnOnClick} className={styles.accordionItemBtn}>
          {data.title}
        </button>
      </h2>
      <div className={styles.accordionItemContainer} style={{ height }}>
        <div ref={contentRef} className={styles.accordionItemContent}>
          {data.content}
        </div>
      </div>
    </li>
  )
}
