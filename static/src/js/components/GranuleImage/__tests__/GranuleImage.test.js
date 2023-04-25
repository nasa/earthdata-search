import React from 'react'
import {
  render,
  screen
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import GranuleImage from '../GranuleImage'

const setup = (props) => {
  render(
    <GranuleImage imageSrc={props.imageSrc} />
  )
}

describe('GranuleImage component', () => {
  describe('when no image is present', () => {
    test('renders itself correctly', () => {
      const props = {
        imageSrc: ''
      }
      setup(props)
      // getByTestId will return an error if it cannot find element queryBy returns null if it cannot
      expect(screen.queryByTestId('granule-image')).toBeNull()
    })
  })

  describe('when an image is present', () => {
    test('renders itself correctly', () => {
      const props = {
        imageSrc: '/some/image/src'
      }
      setup(props)
      expect(screen.getByTestId('granule-image')).toBeTruthy()
    })
  })
})

describe('buttons', () => {
  test('when clicking the close button, closes the image', async () => {
    const props = {
      imageSrc: '/some/image/src'
    }
    const user = userEvent.setup()
    setup(props)
    const closeButton = screen.getByTestId('granule-image__button--close')
    await user.click(closeButton)
    expect(screen.getByTestId('granule-image__button--open')).toBeTruthy()
  })

  test('when clicking the open button, opens the image', async () => {
    const props = {
      imageSrc: '/some/image/src'
    }
    const user = userEvent.setup()
    setup(props)
    const closeButton = screen.getByTestId('granule-image__button--close')
    await user.click(closeButton)

    const openButton = screen.getByTestId('granule-image__button--open')
    await user.click(openButton)
    expect(screen.getByTestId('granule-image__button--close')).toBeTruthy()
  })
})
