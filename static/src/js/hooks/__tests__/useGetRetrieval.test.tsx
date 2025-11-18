import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../jestConfigs/setupTest'
import { useGetRetrieval } from '../useGetRetrieval'
import GET_RETRIEVAL from '../../operations/queries/getRetrieval'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockReturnValue({
    pathname: '/downloads/123456',
    search: '',
    hash: '',
    state: null,
    key: 'testKey'
  }),
  useParams: jest.fn().mockReturnValue({
    id: '123456'
  })
}))

const TestComponent = () => {
  const { loading, retrieval } = useGetRetrieval()

  return (
    <div>
      <span>
        Loading:
        {' '}
        {loading.toString()}
      </span>

      <span>
        Retrieval:
        {' '}
        {JSON.stringify(retrieval)}
      </span>
    </div>
  )
}

const setup = setupTest({
  Component: TestComponent,
  defaultApolloClientMocks: [{
    request: {
      query: GET_RETRIEVAL,
      variables: {
        obfuscatedId: '123456'
      }
    },
    result: {
      data: {
        retrieval: {
          retrievalCollections: {
            obfuscatedId: '98765',
            collectionId: 'collectionId',
            collectionMetadata: {},
            links: []
          },
          id: 1,
          obfuscatedId: '123456',
          jsondata: {}
        }
      }
    }
  }],
  withApolloClient: true,
  withRouter: true
})

describe('useGetRetrieval', () => {
  test('should return loading and retrieval data', async () => {
    setup()

    // Loading state
    expect(screen.getByText('Loading: true')).toBeInTheDocument()
    expect(screen.getByText('Retrieval: {}')).toBeInTheDocument()

    // Wait till the loading is finished
    expect(await screen.findByText('Loading: false')).toBeInTheDocument()

    expect(screen.getByText('Retrieval: {"retrievalCollections":{"obfuscatedId":"98765","collectionId":"collectionId","collectionMetadata":{},"links":[]},"id":1,"obfuscatedId":"123456","jsondata":{}}')).toBeInTheDocument()
  })
})
