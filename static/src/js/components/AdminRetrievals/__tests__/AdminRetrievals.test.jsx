import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import AdminRetrievals from '../AdminRetrievals'
import AdminPage from '../../AdminPage/AdminPage'
import AdminRetrievalsForm from '../AdminRetrievalsForm'
import AdminRetrievalsList from '../AdminRetrievalsList'

jest.mock('../../AdminPage/AdminPage', () => jest.fn().mockImplementation(
  jest.requireActual('../../AdminPage/AdminPage').default
))

jest.mock('../AdminRetrievalsForm', () => jest.fn(() => <div />))
jest.mock('../AdminRetrievalsList', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: AdminRetrievals,
  defaultProps: {
    onAdminViewRetrieval: jest.fn(),
    onUpdateAdminRetrievalsSortKey: jest.fn(),
    onUpdateAdminRetrievalsPageNum: jest.fn(),
    retrievals: {
      allIds: [],
      byId: {},
      pagination: {},
      sortKey: ''
    }
  },
  withRouter: true
})

describe('AdminRetrievals component', () => {
  test('renders itself correctly', () => {
    setup()

    expect(AdminPage).toHaveBeenCalledTimes(1)
    expect(AdminPage).toHaveBeenCalledWith({
      breadcrumbs: [{
        href: '/admin',
        name: 'Admin'
      }, {
        active: true,
        name: 'Retrievals'
      }],
      children: expect.anything(),
      pageTitle: 'Retrievals'
    }, {})

    expect(AdminRetrievalsForm).toHaveBeenCalledTimes(1)
    expect(AdminRetrievalsForm).toHaveBeenCalledWith({
      onAdminViewRetrieval: expect.any(Function)
    }, {})

    expect(AdminRetrievalsList).toHaveBeenCalledTimes(1)
    expect(AdminRetrievalsList).toHaveBeenCalledWith({
      onUpdateAdminRetrievalsSortKey: expect.any(Function),
      onUpdateAdminRetrievalsPageNum: expect.any(Function),
      retrievals: {
        allIds: [],
        byId: {},
        pagination: {},
        sortKey: ''
      }
    }, {})
  })
})
