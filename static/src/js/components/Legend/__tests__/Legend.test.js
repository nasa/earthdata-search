import React from 'react'
import '@testing-library/jest-dom'
import {
  render,
  screen
  // waitFor,
  // within
} from '@testing-library/react'
import 'jest-canvas-mock'

import Legend from '../Legend'

const validColorMap = {
  scale: {
    colors: [
      '#080008',
      '#100010',
      '#180018',
      '#200020',
      '#280028'
    ],
    labels: [
      '0.004 – 0.008 mm',
      '0.008 – 0.013 mm',
      '0.013 – 0.017 mm',
      '0.017 – 0.021 mm',
      '&#8805; 0.025 mm'
    ]
  }
}

describe('Legend', () => {
  describe('when no colormap is provided', () => {
    test('does not render the component', () => {
      const { container } = render(<Legend />)

      expect(container).toBeEmptyDOMElement()
    })
  })

  describe('when a colormap is provided', () => {
    describe('if the scale property does not exist', () => {
      test('does not render the component', () => {
        const { container } = render(<Legend colorMap={{ test: {} }} />)

        expect(container).toBeEmptyDOMElement()
      })
    })

    describe('if the scale property exists', () => {
      test('renders the component', () => {
        const { container } = render(<Legend colorMap={validColorMap} />)

        expect(container).not.toBeEmptyDOMElement()
      })

      test('renders the min label', () => {
        render(<Legend colorMap={validColorMap} />)

        const minLabel = screen.queryByText('0.004 – 0.008 mm')

        expect(minLabel).toBeInTheDocument()
      })

      test('renders and encodes the max label', () => {
        render(<Legend colorMap={validColorMap} />)

        const minLabel = screen.queryByText('≥ 0.025 mm')

        expect(minLabel).toBeInTheDocument()
      })
    })
  })
})
