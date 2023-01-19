import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { DownloadHistoryContainer, mapDispatchToProps, mapStateToProps } from '../DownloadHistoryContainer'
import { DownloadHistory } from '../../../components/DownloadHistory/DownloadHistory'

Enzyme.configure({ adapter: new Adapter() })

function setup(props) {
  const enzymeWrapper = shallow(<DownloadHistoryContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onFetchRetrievalHistory calls actions.fetchRetrievalHistory', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchRetrievalHistory')

    mapDispatchToProps(dispatch).onFetchRetrievalHistory('prod')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('prod')
  })

  test('onDeleteRetrieval calls actions.deleteRetrieval', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'deleteRetrieval')

    mapDispatchToProps(dispatch).onDeleteRetrieval('retrievalId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('retrievalId')
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      earthdataEnvironment: 'prod',
      retrievalHistory: {
        history: {},
        isLoading: false,
        isLoaded: false
      }
    }

    const expectedState = {
      earthdataEnvironment: 'prod',
      retrievalHistory: {},
      retrievalHistoryLoading: false,
      retrievalHistoryLoaded: false
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('DownloadHistoryContainer component', () => {
  describe('when passed the correct props', () => {
    test('renders a table when a retrieval exists with one collection that has no title', () => {
      const { enzymeWrapper } = setup({
        authToken: 'testToken',
        earthdataEnvironment: 'prod',
        retrievalHistory: [{
          id: '8069076',
          jsondata: {},
          created_at: '2019-08-25T11:58:14.390Z',
          collections: [{}]
        }],
        retrievalHistoryLoading: false,
        retrievalHistoryLoaded: false,
        onFetchRetrievalHistory: jest.fn(),
        onDeleteRetrieval: jest.fn()
      })

      expect(enzymeWrapper.find(DownloadHistory).length).toBe(1)
    })
  })
})
