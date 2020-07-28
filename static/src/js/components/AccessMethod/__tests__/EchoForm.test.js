import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import EDSCEchoform from '@edsc/echoforms'

import EchoForm from '../EchoForm'
import { echoForm } from './mocks'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    collectionId: '',
    form: '',
    methodKey: '',
    rawModel: '',
    shapefileId: null,
    spatial: {},
    onUpdateAccessMethod: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<EchoForm {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('EchoForm component', () => {
  test('should render EDSCEchoform component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(EDSCEchoform).exists()).toBeTruthy()
  })

  test('renders an EDSCEchoform with spatial prepopulated', () => {
    const { enzymeWrapper } = setup({
      spatial: {
        polygon: '-77,38,-77,38,-76,38,-77,38'
      }
    })

    expect(enzymeWrapper.find(EDSCEchoform).props().prepopulateValues).toEqual({
      BBOX_EAST: -76,
      BBOX_NORTH: 38.00105844675541,
      BBOX_SOUTH: 37.99999999999998,
      BBOX_WEST: -77
    })
  })

  test('renders an EDSCEchoform with a shapefile', () => {
    const { enzymeWrapper } = setup({
      shapefileId: '1234'
    })

    expect(enzymeWrapper.find(EDSCEchoform).props().hasShapefile).toEqual(true)
  })

  test('onFormModelUpdated calls onUpdateAccessMethod', () => {
    const collectionId = 'collectionId'
    const methodKey = 'echoOrder0'
    const { enzymeWrapper, props } = setup({
      collectionId,
      form: echoForm,
      methodKey
    })

    enzymeWrapper.find(EDSCEchoform).props().onFormModelUpdated({
      model: 'new model',
      rawModel: 'new rawModel'
    })

    expect(props.onUpdateAccessMethod.mock.calls.length).toBe(1)
    expect(props.onUpdateAccessMethod.mock.calls[0]).toEqual([{
      collectionId,
      method: {
        echoOrder0: {
          isValid: true,
          model: 'new model',
          rawModel: 'new rawModel'
        }
      }
    }])
  })

  test('onFormIsValidUpdated calls onUpdateAccessMethod', () => {
    const collectionId = 'collectionId'
    const methodKey = 'echoOrder0'
    const { enzymeWrapper, props } = setup({
      collectionId,
      form: echoForm,
      methodKey
    })

    // Update the form model first so the check for those values pass in updateAccessMethod
    enzymeWrapper.find(EDSCEchoform).props().onFormModelUpdated({
      model: 'new model',
      rawModel: 'new rawModel'
    })

    expect(props.onUpdateAccessMethod.mock.calls.length).toBe(1)

    // Update isValid
    enzymeWrapper.find(EDSCEchoform).props().onFormIsValidUpdated(false)

    expect(props.onUpdateAccessMethod.mock.calls.length).toBe(2)
    expect(props.onUpdateAccessMethod.mock.calls[1]).toEqual([{
      collectionId,
      method: {
        echoOrder0: {
          isValid: false,
          model: 'new model',
          rawModel: 'new rawModel'
        }
      }
    }])
  })
})
