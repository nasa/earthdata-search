import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import SpatialDisplayEntry from '../SpatialDisplayEntry'

const setup = setupTest({
  Component: SpatialDisplayEntry
})

describe('SpatialDisplayEntry component', () => {
  describe('without children', () => {
    test('should render nothing', () => {
      const { container } = setup()

      expect(container.innerHTML).toBe('')
    })
  })

  describe('with children', () => {
    test('should render its children', () => {
      setup({
        overrideProps: {
          children: <div className="test-child">Test</div>
        }
      })

      expect(screen.getByText('Test')).toBeInTheDocument()
    })
  })
})
