import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import AdvancedSearchDisplayEntry from '../AdvancedSearchDisplayEntry'

const setup = setupTest({
  Component: AdvancedSearchDisplayEntry,
  defaultProps: {
    children: null
  }
})

describe('AdvancedSearchDisplayEntry component', () => {
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
