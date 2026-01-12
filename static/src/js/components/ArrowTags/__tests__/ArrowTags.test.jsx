import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import ArrowTags from '../ArrowTags'

const setup = setupTest({
  Component: ArrowTags,
  defaultProps: {
    className: 'test-class',
    tags: ['Item 1', 'Item 2', 'Item 3']
  }
})

describe('ArrowTags component', () => {
  test('renders the tags correctly', () => {
    setup()

    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
    expect(screen.getByText('Item 3')).toBeInTheDocument()
  })

  describe('when no tags are provided', () => {
    test('renders nothing', () => {
      const { container } = setup({
        overrideProps: {
          tags: []
        }
      })

      expect(container.innerHTML).toBe('')
    })
  })

  describe('when a tag in the array does not exist', () => {
    test('renders the tags correctly', () => {
      setup({
        overrideProps: {
          tags: ['Item 1', null, 'Item 3']
        }
      })

      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 3')).toBeInTheDocument()
    })
  })
})
