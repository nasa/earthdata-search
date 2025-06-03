import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import AdminRetrieval from '../AdminRetrieval'
import AdminPage from '../../AdminPage/AdminPage'
import AdminRetrievalDetails from '../../AdminRetrievalDetails/AdminRetrievalDetails'

jest.mock('../../AdminPage/AdminPage', () => jest.fn().mockImplementation(
  jest.requireActual('../../AdminPage/AdminPage').default
))

jest.mock('../../AdminRetrievalDetails/AdminRetrievalDetails', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: AdminRetrieval,
  defaultProps: {
    retrieval: {
      id: 1
    },
    onRequeueOrder: jest.fn()
  },
  withRouter: true
})

describe('AdminRetrieval component', () => {
  test('renders its components correctly', () => {
    setup()

    expect(AdminPage).toHaveBeenCalledTimes(1)
    expect(AdminPage).toHaveBeenCalledWith({
      breadcrumbs: [{
        href: '/admin',
        name: 'Admin'
      }, {
        href: '/admin/retrievals',
        name: 'Retrievals'
      }, {
        active: true,
        name: 'Retrieval Details'
      }],
      children: expect.anything(),
      pageTitle: 'Retrieval Details'
    }, {})

    expect(AdminRetrievalDetails).toHaveBeenCalledTimes(1)
    expect(AdminRetrievalDetails).toHaveBeenCalledWith({
      onRequeueOrder: expect.any(Function),
      retrieval: {
        id: 1
      }
    }, {})
  })
})
