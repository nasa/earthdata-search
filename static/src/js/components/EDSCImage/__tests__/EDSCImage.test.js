import axios from 'axios'
import React from 'react'
import {
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react'
import '@testing-library/jest-dom'

import EDSCImage from '../EDSCImage'

jest.mock('axios')

describe('EDSCImage component', () => {
  describe('when the image has not loaded', () => {
    test('should render a spinner', async () => {
      const { container } = render(
        <EDSCImage
          alt="Test alt text"
          className="test-classname"
          height={500}
          src="http://test.com/test.jpg"
          srcSet="http://test.com/test-2x.jpg 2x, http://test.com/test.jpg 1x"
          width={500}
        />
      )

      const image = screen.queryByAltText('Test alt text')
      const spinner = screen.queryByTestId('edsc-image-spinner')

      expect(image).toBeInTheDocument()
      expect(container.firstChild.classList.contains('edsc-image--is-loaded')).toEqual(false)
      expect(spinner).toBeInTheDocument()
    })
  })

  describe('when the image has loaded', () => {
    test('should not render a spinner', async () => {
      const { container } = render(
        <EDSCImage
          alt="Test alt text"
          className="test-classname"
          height={500}
          src="http://test.com/test.jpg"
          srcSet="http://test.com/test-2x.jpg 2x, http://test.com/test.jpg 1x"
          width={500}
        />
      )

      const image = screen.queryByAltText('Test alt text')
      const spinner = screen.queryByTestId('edsc-image-spinner')

      fireEvent.load(image)

      expect(image).toBeInTheDocument()
      expect(container.firstChild.classList.contains('edsc-image--is-loaded')).toEqual(true)
      expect(spinner).not.toBeInTheDocument()
    })
  })

  describe('when the image has errored', () => {
    test('should not render a spinner', async () => {
      const { container } = render(
        <EDSCImage
          alt="Test alt text"
          className="test-classname"
          height={500}
          src="http://test.com/test.jpg"
          srcSet="http://test.com/test-2x.jpg 2x, http://test.com/test.jpg 1x"
          width={500}
        />
      )

      const image = screen.queryByAltText('Test alt text')
      const spinner = screen.queryByTestId('edsc-image-spinner')

      fireEvent.error(image)

      expect(image).not.toBeInTheDocument()
      expect(container.firstChild.classList.contains('edsc-image--is-errored')).toEqual(true)
      expect(spinner).not.toBeInTheDocument()
    })
  })

  describe('when the image is returned from a `base64` encoded string', () => {
    describe('when the image is still loading', () => {
      test('The spinner is rendered', async () => {
        axios.get.mockResolvedValue({
          data: {
            body: {
              base64Image: 'data:image/png;base64, iVBORw0KGgoAAAAN',
              'content-type': 'image/png'
            }
          }
        })

        const { container } = render(
          <EDSCImage
            alt="Test alt text"
            className="test-classname"
            height={500}
            src="http://test.com/test.jpg"
            srcSet="http://test.com/test-2x.jpg 2x, http://test.com/test.jpg 1x"
            width={500}
            isBase64Image
          />
        )

        const spinner = screen.queryByTestId('edsc-image-spinner')

        expect(container.firstChild.classList.contains('edsc-image--is-loaded')).toEqual(false)
        expect(spinner).toBeInTheDocument()

        // Ensure that once the resource does finnish loading spinner is gone
        await waitFor(() => {
          const image = screen.queryByAltText('Test alt text')
          expect(image).toBeInTheDocument()
          expect(container.firstChild.classList.contains('edsc-image--is-loaded')).toEqual(true)
          expect(spinner).not.toBeInTheDocument()
        })
      })
    })

    describe('when the image has finished loading', () => {
      test('should not render a spinner', async () => {
        axios.get.mockResolvedValue({
          data: {
            body: {
              base64Image: 'data:image/png;base64, iVBORw0KGgoAAAAN',
              'content-type': 'image/png'
            }
          }
        })

        const { container } = render(
          <EDSCImage
            alt="Test alt text"
            className="test-classname"
            height={500}
            src="http://test.com/test.jpg"
            srcSet="http://test.com/test-2x.jpg 2x, http://test.com/test.jpg 1x"
            width={500}
            isBase64Image
          />
        )

        await waitFor(() => {
          const image = screen.queryByAltText('Test alt text')
          const spinner = screen.queryByTestId('edsc-image-spinner')
          expect(image).toBeInTheDocument()
          expect(container.firstChild.classList.contains('edsc-image--is-loaded')).toEqual(true)
          expect(spinner).not.toBeInTheDocument()
        })
      })
    })
  })
})
