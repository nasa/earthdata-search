import { screen } from '@testing-library/react'
import React from 'react'
import setupTest from '../../../../../../jestConfigs/setupTest'
import { AdminRetrievals } from '../AdminRetrievals'
import { AdminRetrievalsList } from '../AdminRetrievalsList'
import { AdminRetrievalsForm } from '../AdminRetrievalsForm'

jest.mock('../AdminRetrievalsList', () => ({
  AdminRetrievalsList: jest.fn(() => <div data-testid="admin-retrievals-list" />)
}))

jest.mock('../AdminRetrievalsForm', () => ({
  AdminRetrievalsForm: jest.fn(() => <div data-testid="admin-retrievals-form" />)
}))

const mockRetrievals = {
  allIds: ['retrieval-1', 'retrieval-2'],
  byId: {
    'retrieval-1': {
      id: 'retrieval-1',
      title: 'Test Retrieval 1'
    },
    'retrieval-2': {
      id: 'retrieval-2',
      title: 'Test Retrieval 2'
    }
  },
  pagination: {
    pageNum: 1,
    pageSize: 20,
    totalResults: 2
  },
  sortKey: 'created_at'
}

const setup = setupTest({
  Component: AdminRetrievals,
  withRouter: true,
  defaultProps: {
    historyPush: jest.fn(),
    onAdminViewRetrieval: jest.fn(),
    onFetchAdminRetrievals: jest.fn(),
    onUpdateAdminRetrievalsSortKey: jest.fn(),
    onUpdateAdminRetrievalsPageNum: jest.fn(),
    retrievals: mockRetrievals
  }
})

describe('when AdminRetrievals is rendered', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders child components with correct props', () => {
    const { props } = setup()

    expect(screen.getByTestId('admin-retrievals-form')).toBeInTheDocument()
    expect(screen.getByTestId('admin-retrievals-list')).toBeInTheDocument()

    expect(AdminRetrievalsForm).toHaveBeenCalledTimes(1)
    expect(AdminRetrievalsForm).toHaveBeenCalledWith({
      onAdminViewRetrieval: props.onAdminViewRetrieval,
      onFetchAdminRetrievals: props.onFetchAdminRetrievals
    }, {})

    expect(AdminRetrievalsList).toHaveBeenCalledTimes(1)
    expect(AdminRetrievalsList).toHaveBeenCalledWith({
      historyPush: props.historyPush,
      onUpdateAdminRetrievalsSortKey: props.onUpdateAdminRetrievalsSortKey,
      onUpdateAdminRetrievalsPageNum: props.onUpdateAdminRetrievalsPageNum,
      retrievals: props.retrievals
    }, {})
  })
})
