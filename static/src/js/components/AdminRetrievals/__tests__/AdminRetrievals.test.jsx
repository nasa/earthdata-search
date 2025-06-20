import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'
import { AdminRetrievals } from '../AdminRetrievals'

const setup = setupTest({
  Component: AdminRetrievals,
  defaultProps: {
    historyPush: jest.fn(),
    onAdminViewRetrieval: jest.fn(),
    onFetchAdminRetrievals: jest.fn(),
    onUpdateAdminRetrievalsSortKey: jest.fn(),
    onUpdateAdminRetrievalsPageNum: jest.fn(),
    retrievals: {
      allIds: [],
      byId: {},
      pagination: {},
      sortKey: ''
    }
  }
})

describe('AdminRetrievals component', () => {
  test('renders itself correctly', () => {
    setup()

    expect(screen.getByText('Retrievals')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Obfuscated Retrieval ID')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter User ID')).toBeInTheDocument()
  })
})
