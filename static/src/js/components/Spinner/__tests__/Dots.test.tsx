import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import Dots from '../Dots'

const setup = setupTest({
  Component: Dots
})

describe('Dots component', () => {
  test('renders correctly', () => {
    setup({
      overrideProps: {
        className: 'test-class',
        color: 'white',
        dataTestId: 'test-id',
        inline: true,
        size: 'small',
        label: 'Please wait...'
      }
    })

    const status = screen.getByRole('status')

    expect(status).toBeInTheDocument()
    expect(status).toHaveClass('spinner spinner--dots spinner--white spinner--small spinner--inline test-class')
    expect(status).toHaveAttribute('aria-label', 'Please wait...')
    expect(status).toHaveAttribute('data-testid', 'test-id')

    // We don't want to ignore this rule, but we just need to verify 3 inner dots are present
    // eslint-disable-next-line testing-library/no-node-access
    const innerDots = screen.getAllByRole('status')[0].querySelectorAll('.spinner__inner')
    expect(innerDots.length).toBe(3)
  })

  test('renders correctly with default props', () => {
    setup()

    const status = screen.getByRole('status')

    expect(status).toBeInTheDocument()
    expect(status).toHaveClass('spinner spinner--dots')
    expect(status).toHaveAttribute('aria-label', 'Loading...')
    expect(status).not.toHaveAttribute('data-testid')

    // We don't want to ignore this rule, but we just need to verify 3 inner dots are present
    // eslint-disable-next-line testing-library/no-node-access
    const innerDots = screen.getAllByRole('status')[0].querySelectorAll('.spinner__inner')
    expect(innerDots.length).toBe(3)
  })
})
