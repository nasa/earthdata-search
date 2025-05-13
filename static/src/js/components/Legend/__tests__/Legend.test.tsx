import { screen } from '@testing-library/react'
import 'jest-canvas-mock'

import Legend from '../Legend'
import setupTest from '../../../../../../jestConfigs/setupTest'

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

const setup = setupTest({
  Component: Legend,
  defaultProps: {
    colorMap: quantitativeColorMap
  }
})

describe('Legend', () => {
  describe('if the scale property exists', () => {
    test('renders the min label', () => {
      setup()

      const minLabel = screen.queryByText('0.004 – 0.008 mm')

      expect(minLabel).toBeInTheDocument()
    })

    test('renders and encodes the max label', () => {
      setup()

      const maxLabel = screen.queryByText('≥ 0.025 mm')

      expect(maxLabel).toBeInTheDocument()
    })
  })

  describe('if the class property exists', () => {
    test('renders the hover prompt', () => {
      setup({
        overrideProps: {
          colorMap: qualitativeColorMap
        }
      })

      const hoverPrompt = screen.queryByText('Hover for class names')

      expect(hoverPrompt).toBeInTheDocument()
    })

    test('does not render the max label', () => {
      setup({
        overrideProps: {
          colorMap: qualitativeColorMap
        }
      })

      const maxLabel = screen.queryByText('Cloud')

      expect(maxLabel).not.toBeInTheDocument()
    })
  })
})
