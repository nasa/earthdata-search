import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { AccessMethod } from '../AccessMethod'
import Radio from '../../FormFields/Radio/Radio'
import RadioList from '../../FormFields/Radio/RadioList'
import EchoForm from '../EchoForm'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    accessMethods: {},
    index: 0,
    isActive: true,
    metadata: {},
    shapefileId: null,
    spatial: {},
    onSelectAccessMethod: jest.fn(),
    onSetActivePanel: jest.fn(),
    onUpdateAccessMethod: jest.fn(),
    selectedAccessMethod: ''
  }

  const enzymeWrapper = shallow(<AccessMethod {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('AccessMethod component', () => {
  test('should render self', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.exists()).toBeTruthy()
  })

  describe('handleAccessMethodSelection', () => {
    test('updates the selected access method', () => {
      const { enzymeWrapper, props } = setup()

      const collectionId = 'collectionId'
      enzymeWrapper.setProps({
        accessMethods: {
          download: {
            isValid: true,
            type: 'download'
          }
        },
        metadata: { id: collectionId }
      })

      const radioList = enzymeWrapper.find(RadioList)
      radioList.props().onChange('download')

      expect(props.onSelectAccessMethod.mock.calls.length).toBe(1)
      expect(props.onSelectAccessMethod.mock.calls[0]).toEqual([{
        collectionId,
        orderCount: 0,
        selectedAccessMethod: 'download'
      }])
    })
  })

  describe('radio button display', () => {
    test('renders a radio button for download', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.setProps({
        accessMethods: {
          download: {
            isValid: true,
            type: 'download'
          }
        }
      })

      expect(enzymeWrapper.find(Radio).props().value).toEqual('download')
    })

    test('renders a radio button for echo orders', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.setProps({
        accessMethods: {
          echoOrder0: {
            isValid: true,
            type: 'ECHO ORDERS'
          }
        }
      })

      expect(enzymeWrapper.find(Radio).props().value).toEqual('echoOrder0')
    })

    test('renders a radio button for esi', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.setProps({
        accessMethods: {
          esi: {
            isValid: true,
            type: 'ESI'
          }
        }
      })

      expect(enzymeWrapper.find(Radio).props().value).toEqual('esi')
    })

    test('renders a radio button for opendap', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.setProps({
        accessMethods: {
          opendap: {
            isValid: true,
            type: 'OPeNDAP'
          }
        }
      })

      expect(enzymeWrapper.find(Radio).props().value).toEqual('opendap')
    })
  })

  describe('when the selected access method has an echoform', () => {
    test('renders an echoform', () => {
      const collectionId = 'collectionId'
      const form = 'echo form here'

      const { enzymeWrapper } = setup()

      enzymeWrapper.setProps({
        accessMethods: {
          echoOrder0: {
            isValid: true,
            type: 'ECHO ORDERS',
            form
          }
        },
        metadata: { id: collectionId },
        selectedAccessMethod: 'echoOrder0'
      })

      const echoForm = enzymeWrapper.find(EchoForm)
      expect(echoForm.props().collectionId).toEqual(collectionId)
      expect(echoForm.props().form).toEqual(form)
      expect(echoForm.props().methodKey).toEqual('echoOrder0')
      expect(echoForm.props().rawModel).toEqual(null)
      expect(typeof echoForm.props().onUpdateAccessMethod).toEqual('function')
    })

    test('renders an echoform with saved fields', () => {
      const collectionId = 'collectionId'
      const form = 'echo form here'
      const rawModel = 'saved fields'

      const { enzymeWrapper } = setup()

      enzymeWrapper.setProps({
        accessMethods: {
          echoOrder0: {
            isValid: true,
            type: 'ECHO ORDERS',
            form,
            rawModel
          }
        },
        metadata: { id: collectionId },
        selectedAccessMethod: 'echoOrder0'
      })

      const echoForm = enzymeWrapper.find(EchoForm)
      expect(echoForm.props().collectionId).toEqual(collectionId)
      expect(echoForm.props().form).toEqual(form)
      expect(echoForm.props().methodKey).toEqual('echoOrder0')
      expect(echoForm.props().rawModel).toEqual(rawModel)
      expect(typeof echoForm.props().onUpdateAccessMethod).toEqual('function')
    })
  })

  describe('when the selected access method is opendap', () => {
    test('selecting a output format calls onUpdateAccessMethod', () => {
      const { enzymeWrapper, props } = setup()

      const collectionId = 'collectionId'

      enzymeWrapper.setProps({
        accessMethods: {
          opendap: {
            isValid: true,
            type: 'OPeNDAP',
            supportedOutputFormats: ['NETCDF-3', 'NETCDF-4']
          }
        },
        metadata: { id: collectionId },
        selectedAccessMethod: 'opendap'
      })

      const outputFormat = enzymeWrapper.find('#input__output-format')
      outputFormat.simulate('change', { target: { value: 'nc4' } })

      expect(props.onUpdateAccessMethod).toBeCalledTimes(1)
      expect(props.onUpdateAccessMethod).toBeCalledWith({
        collectionId: 'collectionId',
        method: {
          opendap: {
            selectedOutputFormat: 'nc4'
          }
        }
      })
    })
  })
})
