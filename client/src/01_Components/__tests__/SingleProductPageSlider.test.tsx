import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import faker from 'faker'
import { images } from '../../fakeData'
import { SingleProductPageSlider, Props } from '../02_Chunks/SingleProductPageSlider/SingleProductPageSlider'
import { setReadOnlyProperty } from '../../04_Utils/testHelpers'

describe('<SingleProductPageSlider />', () => {
  const renderComponent = (props: Props) => render(<SingleProductPageSlider {...props} />)
  it('should display images', () => {
    renderComponent({ images })
    images.forEach(el => {
      const imageEl = screen.queryByAltText(el.imageAlt)
      expect(imageEl).toHaveAttribute('src', el.imageSrc)
    })
  })
  it('should swiper items on mouse move', () => {
    renderComponent({ images })
    const listEl = screen.queryAllByRole('list')[0]
    const containerWidth = faker.datatype.number({ min: 1 })
    const containerScrollWidth = containerWidth * images.length

    setReadOnlyProperty(listEl, 'offsetWidth', containerWidth)
    setReadOnlyProperty(listEl, 'scrollWidth', containerScrollWidth)

    // starting position is 0
    expect(listEl).toHaveStyle({
      transform: 'translate3d(0px, 0, 0)',
    })

    let startX = 0
    let endX = -36
    fireEvent.mouseDown(listEl, { clientX: startX })
    fireEvent.mouseMove(listEl, { clientX: endX })
    fireEvent.mouseUp(listEl)
    // should move to the left
    expect(listEl).toHaveStyle({
      transform: `translate3d(${-containerWidth}px, 0, 0)`,
    })

    startX = 0
    endX = 36
    fireEvent.mouseDown(listEl, { clientX: startX })
    fireEvent.mouseMove(listEl, { clientX: endX })
    fireEvent.mouseUp(listEl)
    // should move to the right
    expect(listEl).toHaveStyle({
      transform: 'translate3d(0px, 0, 0)',
    })

    startX = 0
    endX = -faker.datatype.number({ min: 0, max: 35 })
    // endX = faker.datatype.number({min: 0, max: 35})
    fireEvent.mouseDown(listEl, { clientX: startX })
    fireEvent.mouseMove(listEl, { clientX: endX })
    fireEvent.mouseUp(listEl)
    // should stay in position if less than minimum move
    expect(listEl).toHaveStyle({
      transform: 'translate3d(0px, 0, 0)',
    })

    startX = 0
    endX = 1
    // endX = faker.datatype.number({min: 0, max: 35})
    fireEvent.mouseDown(listEl, { clientX: startX })
    fireEvent.mouseMove(listEl, { clientX: endX })
    fireEvent.mouseUp(listEl)
    // should't move further right if already at the start
    expect(listEl).toHaveStyle({
      transform: 'translate3d(0px, 0, 0)',
    })

    const minOffsetX = containerScrollWidth - containerWidth
    startX = 0
    endX = -(minOffsetX + 1)
    // endX = faker.datatype.number({min: 0, max: 35})
    fireEvent.mouseDown(listEl, { clientX: startX })
    fireEvent.mouseMove(listEl, { clientX: endX })
    fireEvent.mouseUp(listEl)
    // should't move further right if already at the start
    expect(listEl).toHaveStyle({
      transform: `translate3d(${-minOffsetX}px, 0, 0)`,
    })
  })
  it('should swiper items on touch move', () => {
    renderComponent({ images })
    const listEl = screen.queryAllByRole('list')[0]
    const containerWidth = faker.datatype.number({ min: 1 })
    const containerScrollWidth = containerWidth * images.length

    setReadOnlyProperty(listEl, 'offsetWidth', containerWidth)
    setReadOnlyProperty(listEl, 'scrollWidth', containerScrollWidth)

    // starting position is 0
    expect(listEl).toHaveStyle({
      transform: 'translate3d(0px, 0, 0)',
    })

    let startX = 0
    let endX = -36
    fireEvent.touchStart(listEl, { changedTouches: [{ clientX: startX }] })
    fireEvent.touchMove(listEl, { changedTouches: [{ clientX: endX }] })
    fireEvent.touchEnd(listEl)
    // should move to the left
    expect(listEl).toHaveStyle({
      transform: `translate3d(${-containerWidth}px, 0, 0)`,
    })

    startX = 0
    endX = 36
    fireEvent.touchStart(listEl, { changedTouches: [{ clientX: startX }] })
    fireEvent.touchMove(listEl, { changedTouches: [{ clientX: endX }] })
    fireEvent.touchEnd(listEl)
    // should move to the right
    expect(listEl).toHaveStyle({
      transform: 'translate3d(0px, 0, 0)',
    })

    startX = 0
    endX = -faker.datatype.number({ min: 0, max: 35 })
    // endX = faker.datatype.number({min: 0, max: 35})
    fireEvent.touchStart(listEl, { changedTouches: [{ clientX: startX }] })
    fireEvent.touchMove(listEl, { changedTouches: [{ clientX: endX }] })
    fireEvent.touchEnd(listEl)
    // should stay in position if less than minimum move
    expect(listEl).toHaveStyle({
      transform: 'translate3d(0px, 0, 0)',
    })

    startX = 0
    endX = 1
    // endX = faker.datatype.number({min: 0, max: 35})
    fireEvent.touchStart(listEl, { changedTouches: [{ clientX: startX }] })
    fireEvent.touchMove(listEl, { changedTouches: [{ clientX: endX }] })
    fireEvent.touchEnd(listEl)
    // should't move further right if already at the start
    expect(listEl).toHaveStyle({
      transform: 'translate3d(0px, 0, 0)',
    })

    const minOffsetX = containerScrollWidth - containerWidth
    startX = 0
    endX = -(minOffsetX + 1)
    // endX = faker.datatype.number({min: 0, max: 35})
    fireEvent.touchStart(listEl, { changedTouches: [{ clientX: startX }] })
    fireEvent.touchMove(listEl, { changedTouches: [{ clientX: endX }] })
    fireEvent.touchEnd(listEl)
    // should't move further right if already at the start
    expect(listEl).toHaveStyle({
      transform: `translate3d(${-minOffsetX}px, 0, 0)`,
    })
  })
  it('should swipe on indicator click', () => {
    renderComponent({ images })
    const listEl = screen.queryAllByRole('list')[0]
    const containerWidth = faker.datatype.number({ min: 1 })
    const containerScrollWidth = containerWidth * images.length

    setReadOnlyProperty(listEl, 'offsetWidth', containerWidth)
    setReadOnlyProperty(listEl, 'scrollWidth', containerScrollWidth)

    expect(listEl).toHaveStyle({
      transform: 'translate3d(0px, 0, 0)',
    })

    const firstIndicatorEl = screen.queryAllByTestId('indicator')[0]
    expect(firstIndicatorEl).toHaveClass('active')

    const secondIndicatorEl = screen.queryAllByTestId('indicator')[1]
    expect(secondIndicatorEl).not.toHaveClass('active')

    fireEvent.click(secondIndicatorEl)
    expect(firstIndicatorEl).not.toHaveClass('active')
    expect(secondIndicatorEl).toHaveClass('active')
    expect(listEl).toHaveStyle({
      transform: `translate3d(${-containerWidth}px, 0, 0)`,
    })
  })
})
