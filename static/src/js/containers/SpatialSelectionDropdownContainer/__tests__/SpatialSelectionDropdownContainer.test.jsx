import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import { SpatialSelectionDropdownContainer } from '../SpatialSelectionDropdownContainer'

const setup = setupTest({
  Component: SpatialSelectionDropdownContainer,
  defaultProps: {
    onChangeUrl: jest.fn(),
    onChangePath: jest.fn()
  },
  withRouter: true
})

describe('SpatialSelectionDropdownContainer component', () => {
  test('passes its props and renders a single SpatialSelectionDropdown component', () => {
    setup()

    expect(screen.getByRole('button', { name: 'spatial-selection-dropdown' })).toBeInTheDocument()
  })
})
