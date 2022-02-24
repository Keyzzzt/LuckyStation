import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { accordionItems } from '../../fakeData'
import { AccordionItem } from '../02_Chunks/Accordion/AccordionItem'
import faker from 'faker'
import * as hooks from '../../04_Utils/getRefValue'

describe('<AccordionItem>', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })
  it('should render content', () => {
    render(<AccordionItem data={accordionItems[0]} isOpen={faker.datatype.boolean()} btnOnClick={jest.fn()} />)
    const titleEl = screen.queryByText(accordionItems[0].title)
    const contentEl = screen.queryByText(accordionItems[0].content)
    expect(titleEl).toBeInTheDocument()
    expect(contentEl).toBeInTheDocument()
  })
  it('should not display content if isOpen is false', () => {
    const contentScrollHeight = faker.datatype.number({ min: 1 })
    jest.spyOn(hooks, 'getRefValue').mockReturnValue({ scrollHeight: contentScrollHeight })

    render(<AccordionItem data={accordionItems[0]} isOpen={false} btnOnClick={jest.fn()} />)
    const titleEl = screen.queryByText(accordionItems[0].title)
    const listEt = titleEl?.closest('li')
    const contentEl = screen.queryByText(accordionItems[0].content)
    const contentContainerEl = contentEl?.parentElement

    expect(listEt).not.toHaveClass('active')
    expect(contentContainerEl).toHaveStyle({ height: `0px` })
  })
  it('should display content if isOpen is true', () => {
    const contentScrollHeight = faker.datatype.number({ min: 1 })
    jest.spyOn(hooks, 'getRefValue').mockReturnValue({ scrollHeight: contentScrollHeight })

    render(<AccordionItem data={accordionItems[0]} isOpen={true} btnOnClick={jest.fn()} />)

    const titleEl = screen.queryByText(accordionItems[0].title)
    const listEt = titleEl?.closest('li')
    const contentEl = screen.queryByText(accordionItems[0].content)
    const contentContainerEl = contentEl?.parentElement

    expect(contentContainerEl).toHaveStyle({ height: `${contentScrollHeight}px` })
  })
  it('should call btnOnClick on title click', () => {
    const btnOnClickMock = jest.fn()
    render(<AccordionItem data={accordionItems[0]} isOpen={faker.datatype.boolean()} btnOnClick={btnOnClickMock} />)

    const titleEl = screen.queryByText(accordionItems[0].title) as HTMLButtonElement

    fireEvent.click(titleEl)

    expect(btnOnClickMock).toBeCalledTimes(1)
  })
})
