import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { Form } from 'react-bootstrap'
import { Form as FormikForm } from 'formik'

import AdvancedSearchForm from '../AdvancedSearchForm'
import RegionSearch from '../RegionSearch'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    fields: [],
    errors: {},
    handleBlur: jest.fn(),
    handleChange: jest.fn(),
    onChangeRegionQuery: jest.fn(),
    regionSearchResults: {},
    setFieldValue: jest.fn(),
    setModalOverlay: jest.fn(),
    touched: {},
    values: {},
    validateForm: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<AdvancedSearchForm {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('AdvancedSearchForm component', () => {
  test('should render a form', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(FormikForm).length).toEqual(1)
  })

  describe('when provided fields', () => {
    describe('when provided an input', () => {
      test('should render an input', () => {
        const { enzymeWrapper } = setup({
          fields: [
            {
              name: 'testInput',
              type: 'input',
              label: 'Test Input',
              description: 'This is a test description',
              text: 'This is some text'
            }
          ]
        })

        expect(enzymeWrapper.find(Form.Control).length).toEqual(1)
        expect(enzymeWrapper.find(Form.Text).length).toEqual(1)
        expect(enzymeWrapper.find('.advanced-search-form__description').length).toEqual(1)
      })

      describe('when provided an error', () => {
        test('should render an error', () => {
          const { enzymeWrapper } = setup({
            errors: {
              testInput: 'This is an error'
            },
            fields: [
              {
                name: 'testInput',
                type: 'input'
              }
            ]
          })

          expect(enzymeWrapper.find(Form.Control.Feedback).length).toEqual(1)
          expect(enzymeWrapper.find(Form.Control.Feedback).props().type).toEqual('invalid')
        })
      })
    })

    describe('when provided a regionSearch', () => {
      test('should render the RegionSearch component', () => {
        const { enzymeWrapper } = setup({
          fields: [
            {
              name: 'regionSearch',
              type: 'regionSearch',
              label: 'Search by Feature',
              fields: []
            }
          ]
        })

        expect(enzymeWrapper.find(RegionSearch).length).toEqual(1)
      })
    })
  })
})
