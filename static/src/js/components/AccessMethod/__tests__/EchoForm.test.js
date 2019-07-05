import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import EchoForm from '../EchoForm'
import Radio from '../../FormFields/Radio/Radio'
import RadioList from '../../FormFields/Radio/RadioList'
import { rawModel, echoForm, formWithModel } from './mocks'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collectionId: '',
    form: '',
    methodKey: '',
    rawModel: '',
    onUpdateAccessMethod: jest.fn()
  }

  const enzymeWrapper = shallow(<EchoForm {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('EchoForm component', () => {
  test('should render self', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.exists()).toBeTruthy()
  })

  describe('componentWillReceiveProps', () => {
    test('renders a new echoform', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.instance().initializeEchoForm = jest.fn()
      enzymeWrapper.instance().$el.echoforms = jest.fn()

      enzymeWrapper.setProps({
        form: echoForm,
        methodKey: 'echoOrder0',
        rawModel
      })

      expect(enzymeWrapper.instance().$el.echoforms.mock.calls.length).toBe(1)
      expect(enzymeWrapper.instance().$el.echoforms.mock.calls).toEqual([['destroy']])
      expect(enzymeWrapper.instance().initializeEchoForm.mock.calls.length).toBe(1)
      expect(enzymeWrapper.instance().initializeEchoForm.mock.calls[0]).toEqual([echoForm, rawModel])
    })
  })

  describe('componentWillUnmount', () => {
    test('renders a new echoform', () => {
      const { enzymeWrapper } = setup()

      const mockStuff = jest.fn()
      enzymeWrapper.instance().$el.echoforms = mockStuff

      enzymeWrapper.unmount()

      expect(mockStuff.mock.calls.length).toBe(1)
      expect(mockStuff.mock.calls).toEqual([['destroy']])
    })
  })

  describe('initializeEchoForm', () => {
    test('calls insertModelIntoForm', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.instance().insertModelIntoForm = jest.fn()
      enzymeWrapper.instance().$el.echoforms = jest.fn()
      enzymeWrapper.instance().syncModel = jest.fn()

      enzymeWrapper.instance().initializeEchoForm(echoForm)

      expect(enzymeWrapper.instance().insertModelIntoForm.mock.calls.length).toBe(1)
      expect(enzymeWrapper.instance().insertModelIntoForm.mock.calls[0]).toEqual([undefined, echoForm])
    })

    test('initializes the echoform plugin', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.instance().insertModelIntoForm = jest.fn(() => echoForm)
      enzymeWrapper.instance().$el.echoforms = jest.fn()
      enzymeWrapper.instance().syncModel = jest.fn()

      enzymeWrapper.instance().initializeEchoForm(echoForm)

      expect(enzymeWrapper.instance().$el.echoforms.mock.calls.length).toBe(1)
    })

    test('calls syncModel', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.instance().insertModelIntoForm = jest.fn()
      enzymeWrapper.instance().$el.echoforms = jest.fn()
      enzymeWrapper.instance().syncModel = jest.fn()

      enzymeWrapper.instance().initializeEchoForm(echoForm)

      expect(enzymeWrapper.instance().syncModel.mock.calls.length).toBe(1)
    })
  })

  describe('insertModelIntoForm', () => {
    test('updates an echoform with saved fields from a rawModel', () => {
      const { enzymeWrapper } = setup()

      const newForm = enzymeWrapper.instance().insertModelIntoForm(rawModel, echoForm)

      expect(newForm).toEqual(formWithModel)
    })

    test('does not update the echoform if model does not exist', () => {
      const { enzymeWrapper } = setup()

      const newForm = enzymeWrapper.instance().insertModelIntoForm(undefined, echoForm)

      expect(newForm).toEqual(echoForm)
    })
  })

  describe('syncModel', () => {
    test('updates the store with the echoform data', () => {

    })
  })
})
