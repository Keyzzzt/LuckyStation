import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { accordionItems } from '../../fakeData'
import { Accordion } from '../02_Chunks/Accordion/Accordion'

describe('<Accordion>', () => {
  it('should render items', () => {
    render(<Accordion items={accordionItems} />)
    accordionItems.forEach(({ title, content }) => {
      const titleEl = screen.queryByText(title)
      const contentEl = screen.queryByText(content)
      expect(titleEl).toBeInTheDocument()
      expect(contentEl).toBeInTheDocument()
    })
  })
  it('should open one at a time', () => {
    render(<Accordion items={accordionItems} />)
    accordionItems.forEach(({ title, content }) => {
      const titleEl = screen.queryByText(title) as HTMLButtonElement
      fireEvent.click(titleEl)

      const currentListEl = titleEl.closest('li')
      const activeElements = document.querySelectorAll('li.active')
      const activeElement = activeElements[0]

      expect(activeElements.length).toBe(1)
      expect(currentListEl).toEqual(activeElement)
    })
  })
  it('should close if already opened', () => {
    render(<Accordion items={accordionItems} />)
    accordionItems.forEach(({ title, content }) => {
      const titleEl = screen.queryByText(title) as HTMLButtonElement
      fireEvent.click(titleEl)
      fireEvent.click(titleEl)

      const currentListEl = titleEl.closest('li')
      expect(currentListEl).not.toHaveClass('active')
    })
  })
})
