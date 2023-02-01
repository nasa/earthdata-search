import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { mapDispatchToProps, mapStateToProps, CollectionContainer } from '../CollectionContainer'
import CollectionDownloadDisplay from '../../../components/CollectionDownloadDisplay/CollectionDownloadDisplay'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    retrieval: {},
    match: {
      params: {
        id: 'retrievalId'
      },
      path: ''
    },
    onFetchRetrieval: jest.fn(),
    onFetchRetrievalCollectionGranuleLinks: jest.fn(),
    onFetchRetrievalCollectionGranuleBrowseLinks: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<CollectionContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onFetchRetrieval calls actions.fetchRetrieval', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchRetrieval')

    mapDispatchToProps(dispatch).onFetchRetrieval('retrievalId', 'mock-token')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('retrievalId', 'mock-token')
  })

  test('onFetchRetrievalCollectionGranuleLinks calls actions.fetchRetrievalCollectionGranuleLinks', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchRetrievalCollectionGranuleLinks')

    mapDispatchToProps(dispatch).onFetchRetrievalCollectionGranuleLinks('retrievalCollection')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('retrievalCollection')
  })

  test('onFetchRetrievalCollectionGranuleBrowseLinks calls actions.fetchRetrievalCollectionGranuleBrowseLinks', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchRetrievalCollectionGranuleBrowseLinks')

    mapDispatchToProps(dispatch).onFetchRetrievalCollectionGranuleBrowseLinks('retrievalCollection')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('retrievalCollection')
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      authToken: 'mock-token',
      retrieval: {}
    }

    const expectedState = {
      authToken: 'mock-token',
      retrieval: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('CollectionContainer component', () => {
  test('renders a CollectionDownloadDisplay component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(CollectionDownloadDisplay).length).toBe(1)
    expect(enzymeWrapper.find(CollectionDownloadDisplay).props().retrievalCollection).toEqual({})
    expect(typeof enzymeWrapper.find(CollectionDownloadDisplay).props().onFetchRetrievalCollectionGranuleLinks).toEqual('function')
    expect(typeof enzymeWrapper.find(CollectionDownloadDisplay).props().onFetchRetrievalCollectionGranuleBrowseLinks).toEqual('function')
  })

  test('comopnentDidMount calls onFetchRetrieval', () => {
    const { props } = setup()

    expect(props.onFetchRetrieval).toBeCalledTimes(1)
    expect(props.onFetchRetrieval).toBeCalledWith('retrievalId')
  })

  test('componentWillReceiveProps calls onFetchRetrieval', () => {
    const { enzymeWrapper, props } = setup({
      match: {
        params: {}
      }
    })

    enzymeWrapper.setProps({
      match: {
        params: {
          id: 'newRetrievalId'
        }
      }
    })

    expect(props.onFetchRetrieval).toBeCalledTimes(1)
    expect(props.onFetchRetrieval).toBeCalledWith('newRetrievalId')
  })
})
