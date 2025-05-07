import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import {
  mapDispatchToProps,
  mapStateToProps,
  SavedProjectsContainer
} from '../SavedProjectsContainer'
import { SavedProjects } from '../../../components/SavedProjects/SavedProjects'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    onChangePath: jest.fn(),
    authToken: 'default-token',
    earthdataEnvironment: 'default-env',
    ...overrideProps
  }

  const enzymeWrapper = shallow(<SavedProjectsContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onChangePath calls actions.changePath', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changePath')

    mapDispatchToProps(dispatch).onChangePath('path')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('path')
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      authToken: 'mock-auth-token',
      earthdataEnvironment: 'prod'
    }

    const expectedState = {
      authToken: 'mock-auth-token',
      earthdataEnvironment: 'prod'
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('SavedProjectsContainer component', () => {
  describe('when passed the correct props', () => {
    test('renders SavedProjects and passes authToken, earthdataEnvironment, and onChangePath', () => {
      const mockOnChangePath = jest.fn()
      const { enzymeWrapper } = setup({
        onChangePath: mockOnChangePath,
        authToken: 'test-token-123',
        earthdataEnvironment: 'uat'
      })

      expect(enzymeWrapper.find(SavedProjects).length).toBe(1)
      const savedProjectsComponent = enzymeWrapper.find(SavedProjects)

      expect(savedProjectsComponent.props().authToken).toEqual('test-token-123')
      expect(savedProjectsComponent.props().earthdataEnvironment).toEqual('uat')
      expect(savedProjectsComponent.props().onChangePath).toEqual(mockOnChangePath)
    })
  })
})
