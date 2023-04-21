import React from 'react'
import {
  render,
  screen
} from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import GranuleImage from '../GranuleImage'

const setup = (props) => {
  act(() => {
    render(
      <GranuleImage imageSrc={props.imageSrc} />
    )
  })
}

describe('GranuleImage component', () => {
  describe('when no image is present', () => {
    test('renders itself correctly', () => {
      const props = {
        imageSrc: ''
      }
      setup(props)
      expect(screen.queryByRole('button')).toBeNull()
    })
  })

  describe('when an image is present', () => {
    test('renders itself correctly', () => {
      const props = {
        imageSrc: '/some/image/src'
      }
      setup(props)
      expect(screen.queryByRole('button')).toBeTruthy()
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
    const closeButton = screen.getByRole('button')
    await user.click(closeButton)
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

    const openButton = screen.getByRole('button')
    expect(screen.getByRole('button')).toHaveClass('granule-image__button granule-image__button--open')
    await user.click(openButton)
    expect(screen.getByRole('button')).toHaveClass('granule-image__button granule-image__button--close')
  })
})
