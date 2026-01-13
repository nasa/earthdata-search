import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import EDSCModalOverlay from '../EDSCModalOverlay'

const setup = setupTest({
  Component: EDSCModalOverlay,
  defaultProps: {}
})

describe('EDSCModalOverlay component', () => {
  describe('when no children are provided', () => {
    test('should render nothing', () => {
      const { container } = setup()

      expect(container.innerHTML).toBe('')
    })
  })

  describe('when children are provided', () => {
    test('should render the overlay', () => {
      setup({
        overrideProps: {
          children: <div className="test-child">Test</div>
        }
      })

      expect(screen.getByText('Test')).toBeInTheDocument()
    })
  })
})
