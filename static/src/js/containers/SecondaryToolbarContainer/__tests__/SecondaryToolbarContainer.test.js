import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import * as getApplicationConfig from '../../../../../../sharedUtils/config'

import actions from '../../../actions'
import {
  mapDispatchToProps,
  mapStateToProps,
  SecondaryToolbarContainer
} from '../SecondaryToolbarContainer'
import SecondaryToolbar from '../../../components/SecondaryToolbar/SecondaryToolbar'

beforeEach(() => {
  jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
    disableOrdering: false
  }))
})

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    authToken: '',
    earthdataEnvironment: 'prod',
    location: {},
    projectCollectionIds: [],
    savedProject: {},
    retrieval: {},
    onLogout: jest.fn(),
    onUpdateProjectName: jest.fn(),
    onFetchContactInfo: jest.fn(),
    ursProfile: {},
    ...overrideProps
  }

  const enzymeWrapper = shallow(<SecondaryToolbarContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onLogout calls actions.logout', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'logout')

    mapDispatchToProps(dispatch).onLogout()

    expect(spy).toBeCalledTimes(1)
  })

  test('onUpdateProjectName calls actions.updateProjectName', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateProjectName')

    mapDispatchToProps(dispatch).onUpdateProjectName('name')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('name')
  })

  test('onFetchContactInfo calls actions.fetchContactInfo', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchContactInfo')

    mapDispatchToProps(dispatch).onFetchContactInfo()

    expect(spy).toBeCalledTimes(1)
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      authToken: 'mock-token',
      contactInfo: {
        ursProfile: {}
      },
      earthdataEnvironment: 'prod',
      project: {
        collections: {
          allIds: []
        }
      },
      savedProject: {},
      retrieval: {}
    }

    const expectedState = {
      authToken: 'mock-token',
      earthdataEnvironment: 'prod',
      projectCollectionIds: [],
      savedProject: {},
      retrieval: {},
      ursProfile: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('SecondaryToolbarContainer component', () => {
  test('passes its props and renders a single SearchForm component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(SecondaryToolbar).props().authToken).toEqual('')
  })
})

describe('if the secondaryToolbar should be disabled', () => {
  test('passes the `secondaryToolbarEnabled` prop and to the Secondary toolbar as false', () => {
    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      disableDatabaseComponents: true
    }))

    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.find(SecondaryToolbar).props().secondaryToolbarEnabled).toEqual(false)
  })
})
