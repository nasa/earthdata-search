import React from 'react'
import { render, screen } from '@testing-library/react'
import 'jest-canvas-mock'

import Legend from '../Legend'

const quantitativeColorMap = {
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

const qualitativeColorMap = {
  classes: {
    colors: [
      '#080008',
      '#100010',
      '#180018',
      '#200020',
      '#280028'
    ],
    labels: [
      'Not Water',
      'Open Water',
      'Partial Surface Water',
      'Snow/Ice',
      'Cloud'
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
    describe('if neither the scale or class property exist', () => {
      test('does not render the component', () => {
        const { container } = render(<Legend colorMap={{ test: {} }} />)

        expect(container).toBeEmptyDOMElement()
      })
    })

    describe('if the scale property exists', () => {
      test('renders the component', () => {
        const { container } = render(<Legend colorMap={quantitativeColorMap} />)

        expect(container).not.toBeEmptyDOMElement()
      })

      test('renders the min label', () => {
        render(<Legend colorMap={quantitativeColorMap} />)

        const minLabel = screen.queryByText('0.004 – 0.008 mm')

        expect(minLabel).toBeInTheDocument()
      })

      test('renders and encodes the max label', () => {
        render(<Legend colorMap={quantitativeColorMap} />)

        const maxLabel = screen.queryByText('≥ 0.025 mm')

        expect(maxLabel).toBeInTheDocument()
      })
    })

    describe('if the class property exists', () => {
      test('renders the component', () => {
        const { container } = render(<Legend colorMap={qualitativeColorMap} />)

        expect(container).not.toBeEmptyDOMElement()
      })

      test('renders the hover prompt', () => {
        render(<Legend colorMap={qualitativeColorMap} />)

        const hoverPrompt = screen.queryByText('Hover for class names')

        expect(hoverPrompt).toBeInTheDocument()
      })

      test('does not render the max label', () => {
        render(<Legend colorMap={qualitativeColorMap} />)

        const maxLabel = screen.queryByText('Cloud')

        expect(maxLabel).not.toBeInTheDocument()
      })
    })
  })
})
