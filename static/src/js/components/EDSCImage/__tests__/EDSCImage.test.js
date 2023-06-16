import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import EDSCImage from '../EDSCImage'

describe('EDSCImage component', () => {
  describe('when the image has not loaded', () => {
    test('should render a spinner', async () => {
      const { container } = render(
        <EDSCImage
          alt="Test alt text"
          className="test-classname"
          height="500px"
          src="http://test.com/test.jpg"
          srcSet="http://test.com/test-2x.jpg 2x, http://test.com/test.jpg 1x"
          width="500px"
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
          height="500px"
          src="http://test.com/test.jpg"
          srcSet="http://test.com/test-2x.jpg 2x, http://test.com/test.jpg 1x"
          width="500px"
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
          height="500px"
          src="http://test.com/test.jpg"
          srcSet="http://test.com/test-2x.jpg 2x, http://test.com/test.jpg 1x"
          width="500px"
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
})
