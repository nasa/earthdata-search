import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import Skeleton from '../Skeleton'

const setup = setupTest({
  Component: Skeleton,
  defaultProps: {
    className: 'test-class',
    containerStyle: {
      background: 'red',
      border: '1px solid green'
    },
    dataTestId: 'test-id',
    shapes: [{
      height: 12,
      left: 10,
      radius: 3,
      shape: 'rectangle',
      top: 12,
      width: 200,
      'data-testid': 'test-item'
    }]
  }
})

describe('Skeleton component', () => {
  test('renders itself correctly', () => {
    setup()

    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('skeleton')).toHaveStyle('background: red; border: 0.0625rem;')

    expect(screen.getByTestId('test-item-0')).toBeInTheDocument()
    expect(screen.getByTestId('test-item-0')).toHaveStyle('top: 0.75rem; left: 0.625rem; width: 12.5rem; height: 0.75rem; border-radius: 0.1875rem;')
  })

  describe('when passed an unknown shape', () => {
    test('renders no shapes', () => {
      setup({
        overrideProps: {
          shapes: [
            {
              shape: 'unknown',
              left: 10,
              top: 12,
              height: 12,
              width: 200,
              radius: 3,
              'data-testid': 'test-item'
            }
          ]
        }
      })

      expect(screen.getByTestId('skeleton')).toBeInTheDocument()
      expect(screen.getByTestId('skeleton')).toHaveStyle('background: red; border: 0.0625rem;')

      expect(screen.queryByTestId('test-item-0')).not.toBeInTheDocument()
    })
  })

  describe('when passed a multiple shapes', () => {
    test('renders a multiple shapes', () => {
      setup({
        overrideProps: {
          shapes: [
            {
              shape: 'rectangle',
              left: 10,
              top: 12,
              height: 12,
              width: 200,
              radius: 3,
              'data-testid': 'test-item'
            },
            {
              shape: 'rectangle',
              left: 30,
              top: 12,
              height: 12,
              width: 100,
              radius: 3,
              'data-testid': 'test-item'
            }
          ]
        }
      })

      expect(screen.getByTestId('skeleton')).toBeInTheDocument()
      expect(screen.getByTestId('skeleton')).toHaveStyle('background: red; border: 0.0625rem;')

      expect(screen.getByTestId('test-item-0')).toBeInTheDocument()
      expect(screen.getByTestId('test-item-0')).toHaveStyle('top: 0.75rem; left: 0.625rem; width: 12.5rem; height: 0.75rem; border-radius: 0.1875rem;')

      expect(screen.getByTestId('test-item-1')).toBeInTheDocument()
      expect(screen.getByTestId('test-item-1')).toHaveStyle('top: 0.75rem; left: 1.875rem; width: 6.25rem; height: 0.75rem; border-radius: 0.1875rem;')
    })
  })

  describe('when passed a circle shape', () => {
    test('renders a circle shapes', () => {
      setup({
        overrideProps: {
          shapes: [
            {
              shape: 'circle',
              left: '1rem',
              top: '2rem',
              height: '1rem',
              width: '1rem',
              'data-testid': 'test-item'
            }
          ]
        }
      })

      expect(screen.getByTestId('skeleton')).toBeInTheDocument()
      expect(screen.getByTestId('skeleton')).toHaveStyle('background: red; border: 0.0625rem;')

      expect(screen.getByTestId('test-item-0')).toBeInTheDocument()
      expect(screen.getByTestId('test-item-0')).toHaveStyle('top: 2rem; left: 1rem; width: 1rem; height: 1rem; border-radius: 50%;')
    })
  })
})
