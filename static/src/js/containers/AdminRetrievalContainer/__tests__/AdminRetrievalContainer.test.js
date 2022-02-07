import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import actions from '../../../actions'
import AdminRetrieval from '../../../components/AdminRetrieval/AdminRetrieval'
import { AdminRetrievalContainer, mapDispatchToProps, mapStateToProps } from '../AdminRetrievalContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    match: {
      params: {
        id: '1'
      }
    },
    onFetchAdminRetrieval: jest.fn(),
    retrieval: {}
  }

  const enzymeWrapper = shallow(<AdminRetrievalContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onFetchAdminRetrieval calls actions.fetchAdminRetrieval', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchAdminRetrieval')

    mapDispatchToProps(dispatch).onFetchAdminRetrieval('id')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('id')
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      admin: {
        retrievals: {
          byId: {}
        }
      }
    }

    const expectedState = {
      retrievals: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('AdminRetrievalContainer component', () => {
  test('render AdminRetrieval with the correct props', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(AdminRetrieval).length).toBe(1)
  })
})
