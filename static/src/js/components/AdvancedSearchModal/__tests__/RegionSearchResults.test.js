import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Formik } from 'formik'
import { Form } from 'react-bootstrap'

import Button from '../../Button/Button'
import RegionSearchResults from '../RegionSearchResults'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    regionSearchResults: {
      byId: {},
      allIds: []
    },
    setModalOverlay: jest.fn(),
    setFieldValue: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<RegionSearchResults {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('RegionSearchResults component', () => {
  test('should render the region search form results', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toEqual('div')
  })

  describe('onSetSelected', () => {
    test('sets the field value', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.instance().onSetSelected({
        test: 'test'
      })

      expect(props.setFieldValue).toHaveBeenCalledTimes(1)
      expect(props.setFieldValue).toHaveBeenCalledWith(
        'regionSearch.selectedRegion',
        {
          test: 'test'
        }
      )
    })
  })
})
