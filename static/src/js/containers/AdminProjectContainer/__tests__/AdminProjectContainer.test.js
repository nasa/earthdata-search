import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import AdminProject from '../../../components/AdminProject/AdminProject'
import { AdminProjectContainer, mapDispatchToProps, mapStateToProps } from '../AdminProjectContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    match: {
      params: {
        id: '1'
      }
    },
    onFetchAdminProject: jest.fn(),
    project: {}
  }

  const enzymeWrapper = shallow(<AdminProjectContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onFetchAdminProject calls actions.fetchAdminProject', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchAdminProject')

    mapDispatchToProps(dispatch).onFetchAdminProject('id')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('id')
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      admin: {
        projects: {
          byId: {}
        }
      }
    }

    const expectedState = {
      projects: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('AdminProjectContainer component', () => {
  test('render AdminProject with the correct props', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(AdminProject).length).toBe(1)
  })
})
