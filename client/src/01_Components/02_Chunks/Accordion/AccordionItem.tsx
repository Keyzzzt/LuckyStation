import { useEffect, useRef, useState } from 'react'
import s from './accordion.module.scss'
import { AccordionData } from './Accordion'
import { getRefValue } from '../../../04_Utils/getRefValue'

type  AccordionItemProps= {
  data: AccordionData
  isOpen: boolean
  btnOnClick: () => void
}

export const AccordionItem = ({ data, isOpen, btnOnClick }: AccordionItemProps) => {
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
    <li className={`${s.accordionItem} ${isOpen ? s.active : ''}`}>
      <h2 className={s.accordionItemTitle}>
        <button onClick={btnOnClick} className={s.accordionItemBtn}>
          {data.title}
        </button>
      </h2>
      <div className={s.accordionItemContainer} style={{ height }}>
        <div ref={contentRef} className={s.accordionItemContent}>
          {data.content.map((el: any, i: number) =>
            el.value === '' ? null : (
              <div key={i}>
                <div className={s.accordionSubItem}>{el.title}</div>
                <div>{el.value}</div>
              </div>
            )
          )}
        </div>
      </div>
    </li>
  )
}
