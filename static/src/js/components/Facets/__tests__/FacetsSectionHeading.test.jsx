import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'
import FacetsSectionHeading from '../FacetsSectionHeading'

const setup = setupTest({
  Component: FacetsSectionHeading,
  defaultProps: {
    id: 'facets-modal__A',
    letter: 'A'
  }
})

describe('FacetsSectionHeading component', () => {
  test('renders the letter', () => {
    setup()

    const heading = screen.getByRole('heading', { name: 'A' })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveAttribute('id', 'facets-modal__A')
  })
})
