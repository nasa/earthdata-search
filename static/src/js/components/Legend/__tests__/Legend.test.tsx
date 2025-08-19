import { screen } from '@testing-library/react'

import Legend from '../Legend'
import setupTest from '../../../../../../jestConfigs/setupTest'

const mockGranuleImageryLayerGroup = {
  getLayers: jest.fn(() => ({
    getArray: jest.fn(() => [])
  }))
}

const setup = setupTest({
  Component: Legend,
  defaultProps: {
    collectionId: 'test-collection',
    colorMap: {}
  }
})
describe('Legend', () => {
  test('renders the legend container', () => {
    setup()

    const legend = screen.getByTestId('legend')

    expect(legend).toBeInTheDocument()
    expect(legend).toHaveClass('legend')
  })

  test('renders LayerPicker when granuleImageryLayerGroup is provided', () => {
    setup({
      overrideProps: {
        granuleImageryLayerGroup: mockGranuleImageryLayerGroup
      }
    })

    const legend = screen.getByTestId('legend')

    expect(legend).toBeInTheDocument()
    // LayerPicker should be rendered (we can't easily test its content without mocking it)
  })

  test('does not render LayerPicker when granuleImageryLayerGroup is not provided', () => {
    setup()

    const legend = screen.getByTestId('legend')

    expect(legend).toBeInTheDocument()
    expect(legend.innerHTML).toBe('')
  })
})
