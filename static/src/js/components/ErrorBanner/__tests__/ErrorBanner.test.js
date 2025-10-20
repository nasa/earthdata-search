import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@cfaester/enzyme-adapter-react-18'

import * as getApplicationConfig from '../../../../../../sharedUtils/config'

import { ErrorBanner } from '../ErrorBanner'
import Banner from '../../Banner/Banner'
import { displayNotificationType } from '../../../constants/enums'
import useEdscStore from '../../../zustand/useEdscStore'

Enzyme.configure({ adapter: new Adapter() })

jest.mock('../../../zustand/useEdscStore')

const mockRemoveError = jest.fn()

function setup(overrideState = {}) {
  const defaultState = {
    errorsList: [{
      id: 1,
      title: 'title',
      message: 'message',
      notificationType: displayNotificationType.banner
    }]
  }

  const state = {
    ...defaultState,
    ...overrideState
  }

  useEdscStore.mockImplementation((selector) => selector({
    errors: {
      errorsList: state.errorsList,
      removeError: mockRemoveError
    }
  }))

  const enzymeWrapper = shallow(<ErrorBanner />)

  return {
    enzymeWrapper
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('When the database is disabled', () => {
  test('ensure that error messages for database connections refusals do not render', async () => {
    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementationOnce(() => ({
      disableDatabaseComponents: 'true'
    }))

    const { enzymeWrapper } = setup({
      errorsList: [{
        id: 1,
        title: 'example of database refusal error',
        message: 'connect ECONNREFUSED port 12212 this error',
        notificationType: displayNotificationType.banner
      }]
    })

    expect(enzymeWrapper.find(Banner).length).toBe(0)
  })
})

describe('ErrorBanner component', () => {
  test('passes its props and renders a single ErrorBanner component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(Banner).length).toBe(1)
    expect(enzymeWrapper.find(Banner).props().title).toEqual('title')
    expect(enzymeWrapper.find(Banner).props().message).toEqual('message')
    expect(typeof enzymeWrapper.find(Banner).props().onClose).toEqual('function')
  })

  test('does not render an ErrorBanner with no errors', () => {
    const { enzymeWrapper } = setup({ errorsList: [] })

    expect(enzymeWrapper.find(Banner).length).toBe(0)
  })

  test('removeError is called when onClose is triggered', () => {
    const { enzymeWrapper } = setup()

    enzymeWrapper.find(Banner).prop('onClose')()

    expect(mockRemoveError).toHaveBeenCalledTimes(1)
    expect(mockRemoveError).toHaveBeenCalledWith(1)
  })
})
