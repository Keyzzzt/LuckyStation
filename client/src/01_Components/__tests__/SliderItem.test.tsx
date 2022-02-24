import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect";
import { images } from "../../fakeData"
import { SliderItem, SliderItemProps } from "../02_Chunks/SingleProductPageSlider/SliderItem"

describe('<SliderItem />', () => {
    const renderComponent = (props: SliderItemProps) => {
        return render(<SliderItem
            {...props}/>)
    }
    it('should accept imageSrc & imageAlt props', () => {
        renderComponent(images[0])
        const imageEl = screen.queryByAltText(images[0].imageAlt)
        expect(imageEl).toHaveAttribute('src', images[0].imageSrc)
    })

})