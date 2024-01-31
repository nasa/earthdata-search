import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import * as getApplicationConfig from '../../../../../../sharedUtils/config'

import actions from '../../../actions'
import {
  ErrorBannerContainer,
  mapDispatchToProps,
  mapStateToProps
} from '../ErrorBannerContainer'
import Banner from '../../../components/Banner/Banner'
import { displayNotificationType } from '../../../constants/enums'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    errors: [{
      id: 1,
      title: 'title',
      message: 'message',
      notificationType: displayNotificationType.banner
    }],
    onRemoveError: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<ErrorBannerContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('When the database is disabled', () => {
  test('ensure that error messages for database connections refusals do not render', async () => {
    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementationOnce(() => ({
      disableDatabaseComponents: 'true'
    }))

    const { enzymeWrapper } = setup({
      errors: [{
        id: 1,
        title: 'example of database refusal error',
        message: 'connect ECONNREFUSED port 12212 this error',
        notificationType: displayNotificationType.banner
      }]
    })
    expect(enzymeWrapper.find(Banner).length).toBe(0)
  })
})

describe('mapDispatchToProps', () => {
  test('onRemoveError calls actions.removeError', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'removeError')

    mapDispatchToProps(dispatch).onRemoveError('id')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('id')
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      errors: {}
    }

    const expectedState = {
      errors: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('ErrorBannerContainer component', () => {
  test('passes its props and renders a single ErrorBanner component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(Banner).length).toBe(1)
    expect(enzymeWrapper.find(Banner).props().title).toEqual('title')
    expect(enzymeWrapper.find(Banner).props().message).toEqual('message')
    expect(typeof enzymeWrapper.find(Banner).props().onClose).toEqual('function')
  })

  test('does not render an ErrorBanner with no errors', () => {
    const { enzymeWrapper } = setup({ errors: [] })

    expect(enzymeWrapper.find(Banner).length).toBe(0)
  })

  test('onRemoveError passes the correct id', () => {
    const { enzymeWrapper, props } = setup()

    enzymeWrapper.find(Banner).prop('onClose')()

    expect(props.onRemoveError).toHaveBeenCalledTimes(1)
  })
})
