import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import { Provider } from 'react-redux'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import GranuleImage from '../GranuleImage'
import configureStore from '../../../store/configureStore'

const store = configureStore()

const setup = (props) => {
  act(() => {
    render(
      <Provider store={store}>
        <GranuleImage imageSrc={props.imageSrc} />
      </Provider>
    )
  })
}
// todo make sure this is actually covering the test case and
// todo not just passing because it is null
describe('GranuleImage component', () => {
  describe('when no image is present', () => {
    test('renders itself correctly', () => {
      const props = {
        imageSrc: ''
      }
      setup(props)
      // const granuleImage = screen.getByRole('GranuleImage')
      // expect(screen.queryByText('GranuleImage')).toBeNull()
      // expect(screen.getByRole('img')).not().toHaveClass('granule-image__image')
      // expect(screen.getByRole('img')).toBeNull()
      expect(screen.queryByRole('button')).toBeNull()
      // expect(setup(props)).toBeNull()
    })
  })

  describe('when an image is present', () => {
    test('renders itself correctly', () => {
      const props = {
        imageSrc: '/some/image/src'
      }
      setup(props)
      // todo should we be using test-ids?
      expect(screen.queryByRole('button')).toBeTruthy()
      // expect(screen.getByRole('button')).toHaveClass('granule-image__button granule-image__button--close')
      // expect(screen.getByRole('img')).toHaveClass('granule-image__image')
    })
  })
})

describe('buttons', () => {
  test('when clicking the close button, closes the image', async () => {
    const newProps = {
      imageSrc: '/some/image/src'
    }
    const user = userEvent.setup()
    setup(newProps)
    const closeButton = screen.getByRole('button')
    // console.log('🐨 ~ file: GranuleImage.test.js:68 ~ test.only ~ closebutton1:', closebutton1)
    // const closeButton = screen.queryByTestId('granule-image__button granule-image__button--close')
    console.log('🚀 ~ file: GranuleImage.test.js:68 ~ test ~ closeButton:', closeButton)
    // todo mock the handle toggleImage
    await user.click(closeButton)
    // close button is gone and has been toggled so now the only button is the open button
    expect(screen.getByRole('button')).toHaveClass('granule-image__button granule-image__button--open')
  })

  test('when clicking the open button, opens the image', async () => {
    const props = {
      imageSrc: '/some/image/src'
    }
    const user = userEvent.setup()
    setup(props)
    expect(screen.getByRole('button')).toHaveClass('granule-image__button granule-image__button--close')
    const closeButton = screen.getByRole('button')
    await user.click(closeButton)

    // todo now only the open button is in here
    const openButton = screen.getByRole('button')
    expect(screen.getByRole('button')).toHaveClass('granule-image__button granule-image__button--open')
    await user.click(openButton)
    console.log('🚀 ~ file: GranuleImage.test.js:89 ~ test ~ openButton:', openButton)
    expect(screen.getByRole('button')).toHaveClass('granule-image__button granule-image__button--close')
    // expect(screen.getByRole('img')).toHaveClass('granule-image__image')
  })
})

// Enzyme.configure({ adapter: new Adapter() })

// function setup(overrideProps) {
//   const props = {
//     imageSrc: '',
//     ...overrideProps
//   }

//   const enzymeWrapper = shallow(<GranuleImage {...props} />)

//   return {
//     enzymeWrapper,
//     props
//   }
// }

// describe('GranuleImage component', () => {
//   describe('when no image is present', () => {
//     test('renders itself correctly', () => {
//       const { enzymeWrapper } = setup()

//       expect(enzymeWrapper.type()).toBe(null)
//     })
//   })

//   describe('when an image is present', () => {
//     test('renders itself correctly', () => {
//       const { enzymeWrapper } = setup({
//         imageSrc: '/some/image/src'
//       })

//       expect(enzymeWrapper.type()).toBe('div')
//     })
//   })

//   describe('buttons', () => {
//     test('when clicking the close button, closes the image', () => {
//       const { enzymeWrapper } = setup({
//         imageSrc: '/some/image/src'
//       })

//       expect(enzymeWrapper.state().isOpen).toEqual(true)

//       enzymeWrapper.find('.granule-image__button').simulate('click')

//       expect(enzymeWrapper.state().isOpen).toEqual(false)
//     })

//     test('when clicking the open button, closes the image', () => {
//       const { enzymeWrapper } = setup({
//         imageSrc: '/some/image/src'
//       })

//       enzymeWrapper.setState({
//         isOpen: false
//       })

//       expect(enzymeWrapper.state().isOpen).toEqual(false)

//       enzymeWrapper.find('.granule-image__button').simulate('click')

//       expect(enzymeWrapper.state().isOpen).toEqual(true)
//     })
//   })
// })
