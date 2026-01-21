import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import EDSCTableCell from '../EDSCTableCell'

const setup = setupTest({
  Component: EDSCTableCell,
  defaultProps: {
    cell: {
      value: 'test value'
    }
  }
})

describe('EDSCTableCell component', () => {
  test('renders correctly', () => {
    setup()

    expect(screen.getByText('test value')).toBeInTheDocument()
  })
})
