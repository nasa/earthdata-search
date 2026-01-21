import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import AdminRetrieval from '../AdminRetrieval'
import AdminRetrievalDetails from '../../AdminRetrievalDetails/AdminRetrievalDetails'

vi.mock('../../AdminRetrievalDetails/AdminRetrievalDetails', () => ({ default: vi.fn(() => <div />) }))

const setup = setupTest({
  Component: AdminRetrieval,
  withRouter: true
})

describe('AdminRetrieval component', () => {
  test('renders a page heading', () => {
    setup()
    expect(screen.getByRole('heading', { name: 'Retrieval Details' })).toBeInTheDocument()
  })

  test('renders the AdminPreferencesMetricsList component', () => {
    setup()
    expect(AdminRetrievalDetails).toHaveBeenCalledTimes(1)
    expect(AdminRetrievalDetails).toHaveBeenCalledWith({}, {})
  })
})
