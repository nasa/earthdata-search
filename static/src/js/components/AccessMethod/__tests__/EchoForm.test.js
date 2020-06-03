import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { act } from 'react-dom/test-utils'

// eslint-disable-next-line import/named
import EchoForm, { $imports } from '../EchoForm'
import { rawModel, echoForm, formWithModel } from './mocks'

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

  const enzymeWrapper = mount(<EchoForm {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('EchoForm component', () => {
  // Enzyme does not support shallow rendering of useEffect hooks. We also don't want to do a full mount on EDSCEchoform because it is an outside component (and jest xpath does not work).
  // So we are using babel-plugin-mockable-imports to mock EDSCEchoform so we can view it's props during these tests
  beforeEach(() => {
    const MockedEDSCEchoform = props => props.children || null

    $imports.$mock({
      '@edsc/echoforms': { default: MockedEDSCEchoform }
    })
  })

  afterEach(() => {
    $imports.$restore()
  })

  test('should render EDSCEchoform component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('MockedEDSCEchoform').exists()).toBeTruthy()
  })

  test.only('renders an EDSCEchoform with a provided rawModel', () => {
    const collectionId = 'collectionId'
    const methodKey = 'echoOrder0'
    let enzymeWrapper
    act(() => {
      ({ enzymeWrapper } = setup({
        collectionId,
        form: echoForm,
        methodKey,
        rawModel
      }))
    })

    expect(enzymeWrapper.find('MockedEDSCEchoform').props().form).toEqual(formWithModel)
  })

  test('renders an EDSCEchoform with spatial prepopulated', () => {
    const { enzymeWrapper } = setup({
      spatial: {
        polygon: '-77,38,-77,38,-76,38,-77,38'
      }
    })

    expect(enzymeWrapper.find('MockedEDSCEchoform').props().prepopulateValues).toEqual({
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

    expect(enzymeWrapper.find('MockedEDSCEchoform').props().hasShapefile).toEqual(true)
  })

  test('onFormModelUpdated calls onUpdateAccessMethod', () => {
    const collectionId = 'collectionId'
    const methodKey = 'echoOrder0'
    const { enzymeWrapper, props } = setup({
      collectionId,
      form: echoForm,
      methodKey
    })

    act(() => {
      enzymeWrapper.find('MockedEDSCEchoform').props().onFormModelUpdated({
        model: 'new model',
        rawModel: 'new rawModel'
      })
    })

    expect(props.onUpdateAccessMethod.mock.calls.length).toBe(2)
    expect(props.onUpdateAccessMethod.mock.calls[1]).toEqual([{
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

    act(() => {
      enzymeWrapper.find('MockedEDSCEchoform').props().onFormIsValidUpdated(false)
    })

    expect(props.onUpdateAccessMethod.mock.calls.length).toBe(2)
    expect(props.onUpdateAccessMethod.mock.calls[1]).toEqual([{
      collectionId,
      method: {
        echoOrder0: {
          isValid: false,
          model: '',
          rawModel: ''
        }
      }
    }])
  })
})
