import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import FilterStack from '../FilterStack'

const setup = setupTest({
  Component: FilterStack,
  defaultProps: {
    children: undefined,
    isOpen: false
  }
})

describe('FilterStack component', () => {
  test('does not render without children', () => {
    const { container } = setup()

    expect(container.innerHTML).toBe('')
  })

  test('renders its children', () => {
    setup({
      overrideProps: {
        children: 'Hello!'
      }
    })

    expect(screen.getByText('Hello!')).toBeInTheDocument()

    expect(screen.getByRole('list')).not.toHaveClass('filter-stack--is-open')
  })

  test('renders with the correct css when not visible', () => {
    setup({
      overrideProps: {
        isOpen: true,
        children: 'Hello!'
      }
    })

    expect(screen.getByRole('list')).toHaveClass('filter-stack--is-open')
  })
})
