import React from 'react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import AdminRetrievals from '../AdminRetrievals'
import AdminRetrievalsList from '../AdminRetrievalsList'

vi.mock('../AdminRetrievalsList', () => ({ default: vi.fn(() => <div />) }))

const setup = setupTest({
  Component: AdminRetrievals,
  withRouter: true
})

describe('when AdminRetrievals is rendered', () => {
  test('renders child components with correct props', () => {
    setup()

    expect(AdminRetrievalsList).toHaveBeenCalledTimes(1)
    expect(AdminRetrievalsList).toHaveBeenCalledWith({}, {})
  })
})
