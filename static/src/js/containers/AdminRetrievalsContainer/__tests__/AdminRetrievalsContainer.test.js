import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import actions from '../../../actions'
import AdminRetrievals from '../../../components/AdminRetrievals/AdminRetrievals'
import { AdminRetrievalsContainer, mapDispatchToProps, mapStateToProps } from '../AdminRetrievalsContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    history: {
      push: jest.fn()
    },
    onAdminViewRetrieval: jest.fn(),
    onFetchAdminRetrievals: jest.fn(),
    onUpdateAdminRetrievalsSortKey: jest.fn(),
    onUpdateAdminRetrievalsPageNum: jest.fn(),
    retrievals: {}
  }

  const enzymeWrapper = shallow(<AdminRetrievalsContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onAdminViewRetrieval calls actions.adminViewRetrieval', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'adminViewRetrieval')

    mapDispatchToProps(dispatch).onAdminViewRetrieval('retrievalId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('retrievalId')
  })

  test('onFetchAdminRetrievals calls actions.fetchAdminRetrievals', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchAdminRetrievals')

    mapDispatchToProps(dispatch).onFetchAdminRetrievals()

    expect(spy).toBeCalledTimes(1)
  })

  test('onUpdateAdminRetrievalsSortKey calls actions.updateAdminRetrievalsSortKey', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateAdminRetrievalsSortKey')

    mapDispatchToProps(dispatch).onUpdateAdminRetrievalsSortKey('sort-key')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('sort-key')
  })

  test('onUpdateAdminRetrievalsPageNum calls actions.updateAdminRetrievalsPageNum', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateAdminRetrievalsPageNum')

    mapDispatchToProps(dispatch).onUpdateAdminRetrievalsPageNum('sort-key')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('sort-key')
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      admin: {
        retrievals: {
          isLoading: false,
          isLoaded: false
        }
      }
    }

    const expectedState = {
      retrievals: {
        isLoading: false,
        isLoaded: false
      },
      retrievalsLoading: false,
      retrievalsLoaded: false
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('AdminRetrievalsContainer component', () => {
  test('render AdminRetrievals with the correct props', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(AdminRetrievals).length).toBe(1)
  })
})
