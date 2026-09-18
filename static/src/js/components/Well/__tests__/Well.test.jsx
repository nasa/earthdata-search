import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import Well from '../Well'

const setup = setupTest({
  Component: Well,
  defaultProps: {
    children: <Well.Main>Well content</Well.Main>
  }
})

describe('Well component', () => {
  test('renders its children', () => {
    setup()

    expect(screen.getByText('Well content')).toBeInTheDocument()
  })

  test('does not render a heading of its own', () => {
    setup()

    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  test('renders only the headings it is given', () => {
    setup({
      overrideProps: {
        children: (
          <Well.Main>
            <Well.Heading>Download Status</Well.Heading>
          </Well.Main>
        )
      }
    })

    const headings = screen.getAllByRole('heading')

    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent('Download Status')
  })
})
